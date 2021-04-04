/*

 The MIT License (MIT)

 Copyright (c) 2017 Jonas Schnelli

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included
 in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
 OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 
*/

#include "libbtc-config.h"

#include <btc/chainparams.h>
#include <btc/ecc.h>
#include <btc/net.h>
#include <btc/netspv.h>
#include <btc/protocol.h>
#include <btc/random.h>
#include <btc/serialize.h>
#include <btc/tool.h>
#include <btc/tx.h>
#include <btc/utils.h>
#include <btc/wallet.h>

#include <assert.h>
#include <getopt.h>
#include <inttypes.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#include <nSPV_defs.h>

// LIBNSPV_BUILD means to build shared object lib for use in android apk
#if (defined(ANDROID) || defined(__ANDROID__)) && defined(LIBNSPV_BUILD)
#include <android/asset_manager.h>
#include <android/log.h>
#include <stdarg.h>
#endif

static struct option long_options[] =
    {
        {"testnet", no_argument, NULL, 't'},
        {"regtest", no_argument, NULL, 'r'},
        {"ips", no_argument, NULL, 'i'},
        {"debug", no_argument, NULL, 'd'},
        {"maxnodes", no_argument, NULL, 'm'},
        {"dbfile", no_argument, NULL, 'f'},
        {"continuous", no_argument, NULL, 'c'},
        {NULL, 0, NULL, 0}};

static void print_version()
{
    printf("Version: %s %s\n", PACKAGE_NAME, PACKAGE_VERSION);
}

static void print_usage()
{
    print_version();
    printf("Usage: nspv [COIN defaults to NSPV] (-c|continuous) (-i|-ips <ip,ip,...]>) (-m[--maxpeers] <int>) (-t[--testnet]) (-f <headersfile|0 for in mem only>) (-p <rpcport>) (-r[--regtest]) (-d[--debug]) (-x=<externalip>) (-l=language) (-s[--timeout] <secs>) <command>\n");
    printf("Supported commands:\n");
    printf("        scan      (scan blocks up to the tip, creates header.db file)\n");
    printf("\nExamples: \n");
    printf("Sync up to the chain tip and stores all headers in headers.db (quit once synced):\n");
    printf("> nspv scan\n\n");
    printf("Sync up to the chain tip and give some debug output during that process:\n");
    printf("> nspv -d scan\n\n");
    printf("Sync up, show debug info, don't store headers in file (only in memory), wait for new blocks:\n");
    printf("> nspv -d -f 0 -c scan\n\n");
}

#if defined(LIBNSPV_BUILD)
#if !defined(__ANDROID__) && !defined(ANDROID)
// extern FILE *nspv_get_fdebug();
// for the lib logging is to a file
FILE* nspv_get_fdebug()
{
    static FILE* fdebug = NULL;
    // TODO: make fdebug open multithreaded
    if (fdebug == NULL) {
        fdebug = fopen("nspv-debug.log", "a");
    }
    return fdebug;
}
#endif
#else
FILE* nspv_get_fdebug()
{
    return stderr;
}
#endif


static bool showError(const char* er)
{
    printf("Error: %s\n", er);
    return 1;
}

btc_bool spv_header_message_processed(struct btc_spv_client_* client, btc_node* node, btc_blockindex* newtip)
{
    UNUSED(client);
    UNUSED(node);
    if (newtip) {
        printf("New headers tip height %d\n", newtip->height);
    }
    return true;
}

static btc_bool quit_when_synced = true;
void spv_sync_completed(btc_spv_client* client)
{
    printf("Sync completed, at height %d\n", client->headers_db->getchaintip(client->headers_db_ctx)->height);
    if (quit_when_synced) {
        btc_node_group_shutdown(client->nodegroup);
    } else {
        printf("Waiting for new blocks or relevant transactions...\n");
    }
}

#include "curve25519.c"
#include "nSPV_CCtx.h"
#include "nSPV_structs.h"
#include "nSPV_utils.h"
#include "tweetnacl.c"
//not used: #include "nSPV_jpeg.h"
#include "nSPV_superlite.h"
#include "nSPV_wallet.h"

// do not add html gui if lib
#if !defined(LIBNSPV_BUILD)
#include "nSPV_htmlgui.h"
#endif

#include "komodo_cJSON.c"

// do not run rpc loop if lib
#if !defined(LIBNSPV_BUILD)
#include "nSPV_rpc.h"
#endif

const btc_chainparams* NSPV_coinlist_scan(char* symbol, const btc_chainparams* template)
{
    btc_chainparams* chain = 0;
    char *filestr, *name, *seeds, *magic = 0;
    int32_t i, n;
    cJSON *array, *coin;
    long filesize;
    chain = calloc(1, sizeof(*chain));
    memcpy(chain, template, sizeof(*chain));
    chain->default_port = 0;
    memset(chain->name, 0, sizeof(chain->name));
    if ((filestr = OS_filestr(&filesize, "coins")) != NULL) {
        nspv_log_message("loaded coins file size=%ld\n", filesize);
        if ((array = cJSON_Parse(filestr)) != 0) {
            n = cJSON_GetArraySize(array);
            for (i = 0; i < n; i++) {
                coin = jitem(array, i);
                nspv_log_message("checking coin config: %s\n", jprint(coin, 0));
                if ((name = jstr(coin, "coin")) != 0 && strcmp(name, symbol) == 0 && jstr(coin, "asset") != 0) {
                    if ((seeds = jstr(coin, "nSPV")) != 0 && strlen(seeds) < sizeof(chain->dnsseeds[0].domain) - 1 && (magic = jstr(coin, "magic")) != 0 && strlen(magic) == 8) {
                        if (jstr(coin, "fname") != 0)
                            strcpy(NSPV_fullname, jstr(coin, "fname"));
                        chain->default_port = juint(coin, "p2p");
                        chain->rpcport = juint(coin, "rpcport");
                        strcpy(chain->dnsseeds[0].domain, seeds);
                        char tmp[9];
                        strcpy(tmp, magic);
                        decode_hex((uint8_t*)chain->netmagic, 4, tmp);
                        strcpy(chain->name, symbol);
                        nspv_log_message("Found (%s) magic.%s, p2p.%u seeds.(%s)\n", symbol, magic, chain->default_port, seeds);
                        break;
                    }
                }
            }
            if (i == n) {
                free(chain);
                chain = 0;
            }
            cJSON_Delete(array);
        } else {
            nspv_log_message("parse error of coins file\n");
#ifdef LIBNSPV_BUILD
            free(chain);
            chain = NULL;
#else
            exit(-1);
#endif
        }
        free(filestr);
    } else {
        nspv_log_message("could not find coins file\n");
#ifdef LIBNSPV_BUILD
        free(chain);
        chain = (void*)0xFFFFFFFFFFFFFFFFLL; // TODO: avoid use 0xFFF..FF
#endif
    }
    return ((const btc_chainparams*)chain);
}

#if !defined(LIBNSPV_BUILD)
int main(int argc, char* argv[])
{
    int ret = 0;
    int long_index = 0;
    int opt = 0;
    char* data = 0;
    char* ips = 0;
    btc_bool debug = false;
    int timeout = 15;
    int maxnodes = 10;
    char* dbfile = 0;
    const btc_chainparams* chain = &kmd_chainparams_main;
    portable_mutex_init(&NSPV_commandmutex);
    portable_mutex_init(&NSPV_netmutex);
    if (argc > 1) {
        if (strcmp(argv[1], "BTC") == 0) {
            chain = &btc_chainparams_main;
            argc--;
            argv++;
        } else if (strcmp(argv[1], "KMD") == 0) {
            chain = &kmd_chainparams_main;
            argc--;
            argv++;
        } else if ((chain = NSPV_coinlist_scan(argv[1], &kmd_chainparams_main)) != 0) {
            argc--;
            argv++;
        }
        /*
        else if ( strcmp(argv[1],"ILN") == 0 )
        {
            chain = &iln_chainparams_main;
            argc--;
            argv++;
        }
        else */
    }
    if (chain == 0) {
        chain = &kmd_chainparams_main;
        fprintf(stderr, "couldnt match coin, defaulting to KMD chain\n");
    }
    if (chain->komodo == 0 && (argc <= 1 || strlen(argv[argc - 1]) == 0 || argv[argc - 1][0] == '-')) {
        // exit if no command was provided
        print_usage();
        exit(EXIT_FAILURE);
    }
    data = argv[argc - 1];
    strcpy(NSPV_symbol, chain->name);
    // get arguments
    uint16_t port = 0;
    while ((opt = getopt_long_only(argc, argv, "i:ctrds:m:f:p:x:l:", long_options, &long_index)) != -1) {
        switch (opt) {
        case 'c':
            quit_when_synced = false;
            break;
        case 't':
            chain = &btc_chainparams_test;
            break;
        case 'r':
            chain = &btc_chainparams_regtest;
            break;
        case 'd':
            debug = true;
            break;
        case 's':
            timeout = (int)strtol(optarg, (char**)NULL, 10);
            break;
        case 'i':
            ips = optarg;
            break;
        case 'm':
            maxnodes = (int)strtol(optarg, (char**)NULL, 10);
            break;
        case 'p':
            port = (int)strtol(optarg, (char**)NULL, 0);
            fprintf(stderr, "set port to %u\n", port);
            break;
        case 'x':
            if (optarg != 0) {
                NSPV_externalip = clonestr(optarg + 1);
                fprintf(stderr, "set external ip to %s\n", NSPV_externalip);
            }
            break;
        case 'l':
            if (optarg != 0) {
                strcpy(NSPV_language, optarg + 1);
                fprintf(stderr, "set language to (%s)\n", NSPV_language);
            }
            break;
        case 'f':
            dbfile = optarg;
            break;
        case 'v':
            print_version();
            exit(EXIT_SUCCESS);
            break;
        default:
            print_usage();
            exit(EXIT_FAILURE);
        }
    }
    if (port == 0)
        port = chain->rpcport;
    else
        memcpy((void*)&chain->rpcport, &port, sizeof(chain->rpcport));
    NSPV_chain = chain;
    if (chain->komodo != 0) {
        int32_t i;
        uint256 revhash;
        if (ips == 0)
            ips = (char*)chain->dnsseeds[0].domain;
        for (i = 0; i < (int32_t)sizeof(revhash); i++) {
            revhash[i] = chain->genesisblockhash[31 - i];
            fprintf(stderr, "%02x", chain->genesisblockhash[i]);
        }
        memcpy((void*)chain->genesisblockhash, revhash, sizeof(chain->genesisblockhash));
        fprintf(stderr, " genesisblockhash %s\n", chain->name);
        data = (char*)"scan";
    }
    pthread_t thread;
    if (OS_thread_create(&thread, NULL, NSPV_rpcloop, (void*)&port) != 0) {
        printf("error launching NSPV_rpcloop for port.%u\n", port);
        exit(-1);
    }
    if (strcmp(data, "scan") == 0) {
        char walletname[64], headersname[64];
        int32_t i, error, res;
        sprintf(walletname, "wallet.%s", chain->name);
        sprintf(headersname, "headers.%s", chain->name);
        btc_ecc_start();
        btc_spv_client* client = btc_spv_client_new(chain, debug, (dbfile && (dbfile[0] == '0' || (strlen(dbfile) > 1 && dbfile[0] == 'n' && dbfile[0] == 'o'))) ? true : false);
        NSPV_client = client;
        if (chain->nSPV == 0) {
            btc_wallet* wallet = btc_wallet_new(chain);
            btc_bool created;
            res = btc_wallet_load(wallet, walletname, &error, &created);
            if (!res) {
                fprintf(stdout, "Loading %s failed error.%d\n", walletname, error);
                exit(EXIT_FAILURE);
            }
            if (created != 0) {
                // create a new key
                btc_hdnode node;
                uint8_t seed[32];
                assert(btc_random_bytes(seed, sizeof(seed), true));
                btc_hdnode_from_seed(seed, sizeof(seed), &node);
                btc_wallet_set_master_key_copy(wallet, &node);
            } else {
                // ensure we have a key
                fprintf(stderr, "TODO: ensure there is a key\n");
            }

            btc_wallet_hdnode* node = btc_wallet_next_key(wallet);
            size_t strsize = 128;
            char str[strsize];
            btc_hdnode_get_p2pkh_address(node->hdnode, chain, str, strsize);
            printf("%s Wallet addr: %s (child %d)\n", chain->name, str, node->hdnode->child_num);
            vector* addrs = vector_new(1, free);
            btc_wallet_get_addresses(wallet, addrs);
            for (i = 0; i < (int32_t)addrs->len; i++) {
                char* addr = vector_idx(addrs, i);
                printf("Addr: %s\n", addr);
            }
            vector_free(addrs, true);
            client->sync_completed = spv_sync_completed;
            client->sync_transaction = btc_wallet_check_transaction;
            client->sync_transaction_ctx = wallet;
        }
        client->header_message_processed = spv_header_message_processed;
        if (chain->nSPV == 0 && !btc_spv_client_load(client, (dbfile ? dbfile : headersname))) {
            nspv_log_message("Could not load or create %s database...aborting\n", headersname);
            ret = EXIT_FAILURE;
        } else {
            nspv_log_message("Discover %s peers...", chain->name);
            btc_spv_client_discover_peers(client, ips);
            btc_spv_client_runloop(client);
            nspv_log_message("end of client runloop\n");
            btc_spv_client_free(client);
            NSPV_STOP_RECEIVED = (uint32_t)time(NULL);
#if !defined(__ANDROID__) && !defined(ANDROID)
            // no pthread_cancel in Android NDK
            // actually no need to pthread_cancel if NSPV_STOP_RECEIVED is used to finish the thread,
            // it is sufficient just to wait for the thread end in pthread_join
            pthread_cancel(thread);
#endif
            ret = EXIT_SUCCESS;
        }
        btc_ecc_stop();
    } else {
        printf("Invalid command (use -?)\n");
        ret = EXIT_FAILURE;
    }
    pthread_join(thread, NULL);
    return ret;
}
#endif
