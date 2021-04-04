
/******************************************************************************
 * Copyright © 2014-2019 The SuperNET Developers.                             *
 *                                                                            *
 * See the AUTHORS, DEVELOPER-AGREEMENT and LICENSE files at                  *
 * the top-level directory of this distribution for the individual copyright  *
 * holder information and the developer policies on copyright and licensing.  *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * SuperNET software, including this file may be copied, modified, propagated *
 * or distributed except according to the terms contained in the LICENSE file *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

#ifndef KOMODO_NSPVSUPERLITE_H
#define KOMODO_NSPVSUPERLITE_H

#include <btc/base58.h>
#include <btc/block.h>
#include <btc/blockchain.h>
#include <btc/headersdb.h>
#include <btc/headersdb_file.h>
#include <btc/net.h>
#include <btc/netspv.h>
#include <btc/protocol.h>
#include <btc/serialize.h>
#include <btc/tx.h>
#include <btc/utils.h>

#include "nSPV_defs.h"

extern char* NSPV_externalip;
static uint32_t starttime = 0;
cJSON* NSPV_spend(btc_spv_client* client, char* srcaddr, char* destaddr, int64_t satoshis);
cJSON* NSPV_txproof(int32_t waitflag, btc_spv_client* client, int32_t vout, bits256 txid, int32_t height);
btc_tx* NSPV_gettransaction(btc_spv_client* client, int32_t* retvalp, int32_t isKMD, int32_t skipvalidation, int32_t v, bits256 txid, int32_t height, int64_t extradata, uint32_t tiptime, int64_t* rewardsump);

uint32_t NSPV_logintime, NSPV_tiptime, NSPV_didfirstutxos, NSPV_didfirsttxids, NSPV_lastgetinfo;
int32_t NSPV_didfirsttxproofs, NSPV_longestchain = 0;
char NSPV_tmpseed[4096], NSPV_walletseed[4096], NSPV_lastpeer[64], NSPV_address[64], NSPV_wifstr[64], NSPV_pubkeystr[67], NSPV_symbol[64], NSPV_fullname[64];
char NSPV_language[64] = {"english"};

btc_spv_client* NSPV_client;
const btc_chainparams* NSPV_chain;
int64_t NSPV_balance, NSPV_rewards, NSPV_totalsent, NSPV_totalrecv;

btc_key NSPV_key;
btc_pubkey NSPV_pubkey;
struct NSPV_inforesp NSPV_inforesult;
struct NSPV_utxosresp NSPV_utxosresult;
struct NSPV_txidsresp NSPV_txidsresult;
struct NSPV_mempoolresp NSPV_mempoolresult;
struct NSPV_spentinfo NSPV_spentresult;
struct NSPV_ntzsresp NSPV_ntzsresult;
struct NSPV_ntzsproofresp NSPV_ntzsproofresult;
struct NSPV_txproof NSPV_txproofresult;
// struct NSPV_broadcastresp NSPV_broadcastresult;                  // moved to node group to avoid thread concurrency
// struct NSPV_remoterpcresp NSPV_remoterpcresult = { "", NULL };   // moved to node group to avoid thread concurrency

struct NSPV_ntzsresp NSPV_ntzsresp_cache[NSPV_MAXVINS];
struct NSPV_ntzsproofresp NSPV_ntzsproofresp_cache[NSPV_MAXVINS * 2];
struct NSPV_txproof NSPV_txproof_cache[NSPV_MAXVINS * 10];

// validation
struct NSPV_ntz NSPV_lastntz;
// limitation here is that 128 block history is maximum. no notarizations for 128 blocks and we cant sync back to the notarization, we must wait for the next one.
struct NSPV_header NSPV_blockheaders[NSPV_MAX_BLOCK_HEADERS];
int32_t NSPV_num_headers = 0;
int32_t NSPV_hdrheight_counter;
uint64_t NSPV_nodemask = 0;
int32_t IS_IN_SYNC = 0;

struct NSPV_ntzsresp* NSPV_ntzsresp_find(int32_t reqheight)
{
    uint32_t i;
    for (i = 0; i < sizeof(NSPV_ntzsresp_cache) / sizeof(*NSPV_ntzsresp_cache); i++)
        if (NSPV_ntzsresp_cache[i].reqheight == reqheight)
            return (&NSPV_ntzsresp_cache[i]);
    return (0);
}

struct NSPV_ntzsresp* NSPV_ntzsresp_add(struct NSPV_ntzsresp* ptr)
{
    uint32_t i;
    for (i = 0; i < sizeof(NSPV_ntzsresp_cache) / sizeof(*NSPV_ntzsresp_cache); i++)
        if (NSPV_ntzsresp_cache[i].reqheight == 0)
            break;
    if (i == sizeof(NSPV_ntzsresp_cache) / sizeof(*NSPV_ntzsresp_cache))
        i = (rand() % (sizeof(NSPV_ntzsresp_cache) / sizeof(*NSPV_ntzsresp_cache)));
    NSPV_ntzsresp_purge(&NSPV_ntzsresp_cache[i]);
    NSPV_ntzsresp_copy(&NSPV_ntzsresp_cache[i], ptr);
    fprintf(stderr, "ADD CACHE ntzsresp req.%d\n", ptr->reqheight);
    return (&NSPV_ntzsresp_cache[i]);
}

struct NSPV_txproof* NSPV_txproof_find(bits256 txid, int32_t height)
{
    uint32_t i;
    struct NSPV_txproof* backup = 0;
    for (i = 0; i < sizeof(NSPV_txproof_cache) / sizeof(*NSPV_txproof_cache); i++)
        if (memcmp(&NSPV_txproof_cache[i].txid, &txid, sizeof(txid)) == 0 && (height == 0 || NSPV_txproof_cache[i].height == height)) {
            if (NSPV_txproof_cache[i].txprooflen != 0)
                return (&NSPV_txproof_cache[i]);
            else
                backup = &NSPV_txproof_cache[i];
        }
    return (backup);
}

struct NSPV_txproof* NSPV_txproof_add(struct NSPV_txproof* ptr)
{
    uint32_t i;
    char str[65];
    for (i = 0; i < sizeof(NSPV_txproof_cache) / sizeof(*NSPV_txproof_cache); i++)
        if (memcmp(&NSPV_txproof_cache[i].txid, &ptr->txid, sizeof(ptr->txid)) == 0) {
            if (NSPV_txproof_cache[i].txprooflen == 0 && ptr->txprooflen != 0) {
                NSPV_txproof_purge(&NSPV_txproof_cache[i]);
                NSPV_txproof_copy(&NSPV_txproof_cache[i], ptr);
                return (&NSPV_txproof_cache[i]);
            } else if (NSPV_txproof_cache[i].txprooflen != 0 || ptr->txprooflen == 0)
                return (&NSPV_txproof_cache[i]);
        }
    for (i = 0; i < sizeof(NSPV_txproof_cache) / sizeof(*NSPV_txproof_cache); i++)
        if (NSPV_txproof_cache[i].txlen == 0)
            break;
    if (i == sizeof(NSPV_txproof_cache) / sizeof(*NSPV_txproof_cache))
        i = (rand() % (sizeof(NSPV_txproof_cache) / sizeof(*NSPV_txproof_cache)));
    NSPV_txproof_purge(&NSPV_txproof_cache[i]);
    NSPV_txproof_copy(&NSPV_txproof_cache[i], ptr);
    fprintf(stderr, "ADD CACHE txproof %s\n", bits256_str(str, ptr->txid));
    return (&NSPV_txproof_cache[i]);
}

struct NSPV_ntzsproofresp* NSPV_ntzsproof_find(bits256 prevtxid, bits256 nexttxid)
{
    uint32_t i;
    for (i = 0; i < sizeof(NSPV_ntzsproofresp_cache) / sizeof(*NSPV_ntzsproofresp_cache); i++)
        if (memcmp(&NSPV_ntzsproofresp_cache[i].prevtxid, &prevtxid, sizeof(prevtxid)) == 0 && memcmp(&NSPV_ntzsproofresp_cache[i].nexttxid, &nexttxid, sizeof(nexttxid)) == 0)
            return (&NSPV_ntzsproofresp_cache[i]);
    return (0);
}

struct NSPV_ntzsproofresp* NSPV_ntzsproof_add(struct NSPV_ntzsproofresp* ptr)
{
    uint32_t i;
    for (i = 0; i < sizeof(NSPV_ntzsproofresp_cache) / sizeof(*NSPV_ntzsproofresp_cache); i++)
        if (NSPV_ntzsproofresp_cache[i].common.hdrs == 0)
            break;
    if (i == sizeof(NSPV_ntzsproofresp_cache) / sizeof(*NSPV_ntzsproofresp_cache))
        i = (rand() % (sizeof(NSPV_ntzsproofresp_cache) / sizeof(*NSPV_ntzsproofresp_cache)));
    NSPV_ntzsproofresp_purge(&NSPV_ntzsproofresp_cache[i]);
    NSPV_ntzsproofresp_copy(&NSPV_ntzsproofresp_cache[i], ptr);
    return (&NSPV_ntzsproofresp_cache[i]);
}

void NSPV_logout()
{
    if (NSPV_logintime != 0)
        nspv_log_message("scrub wif and privkey from NSPV memory\n");
    memset(NSPV_ntzsproofresp_cache, 0, sizeof(NSPV_ntzsproofresp_cache));
    memset(NSPV_txproof_cache, 0, sizeof(NSPV_txproof_cache));
    memset(NSPV_ntzsresp_cache, 0, sizeof(NSPV_ntzsresp_cache));
    memset(NSPV_wifstr, 0, sizeof(NSPV_wifstr));
    memset(NSPV_walletseed, 0, sizeof(NSPV_walletseed));
    memset(&NSPV_key, 0, sizeof(NSPV_key));
    NSPV_didfirstutxos = NSPV_logintime = 0;
    NSPV_didfirsttxproofs = 0;
}

btc_node* NSPV_req(btc_spv_client* client, btc_node* node, uint8_t* msg, uint32_t msg_len, uint64_t mask, int32_t ind)
{
    int32_t i, n, flag = 0;
    btc_node* nodes[64];
    uint32_t timestamp = (uint32_t)time(NULL);
    if (node == 0) {
        memset(nodes, 0, sizeof(nodes));
        n = 0;
        nspv_log_message("%s nodes->len %d\n", __func__, client->nodegroup->nodes->len);
        for (i = 0; i < (int32_t)client->nodegroup->nodes->len; i++) {
            btc_node* ptr = vector_idx(client->nodegroup->nodes, i);
            if (ptr->prevtimes[ind] > timestamp)
                ptr->prevtimes[ind] = 0;
            
            nspv_log_message("%s node %d state %d timestamp %d prevtimes[ind] %d nServices %d mask %d\n", __func__, ptr->nodeid, ptr->state, timestamp, ptr->prevtimes[ind], ptr->nServices, mask);

            if ((ptr->state & NODE_CONNECTED) == NODE_CONNECTED) {
                if ((ptr->nServices & mask) == mask && timestamp > ptr->prevtimes[ind]) {
                    flag = 1;
                    nodes[n++] = ptr;
                    NSPV_nodemask |= (NSPV_nodemask & (1LL << ptr->nodeid));
                    if (n == sizeof(nodes) / sizeof(*nodes))
                        break;
                }
            }
        }
        if (n > 0) {
            node = nodes[rand() % n];
            nspv_log_message("%s selected node %s\n", __func__, node->ipaddr);
        }
        client->nodegroup->NSPV_num_connected_nodes = n;

    } else
        flag = 1; // seems flag not used
    if (node != 0) {
        /*if (len >= 0xfd) {
            //fprintf(stderr,"len.%d overflow for 1 byte varint\n",len);
            msg[0] = 0xfd;
            msg[1] = (len - 3) & 0xff;
            msg[2] = ((len - 1) >> 8) & 0xff;
        } else
            msg[0] = len - 1;*/

        uint8_t *pushed_msg = NULL;
        uint32_t pushed_len = 0;    
        write_compact_size_and_msg(&pushed_msg, &pushed_len, msg, msg_len);
        cstring* request = btc_p2p_message_new(node->nodegroup->chainparams->netmagic, "getnSPV", pushed_msg, pushed_len);
        btc_node_send(node, request);
        cstr_free(request, true);
        free(pushed_msg);
        //fprintf(stderr,"pushmessage [%d] len.%d\n",msg[1],len);
        node->prevtimes[ind] = timestamp;
        NSPV_totalsent += pushed_len;
        nspv_log_message("%s \"getnSPV\" request sent to node %d %s\n", __func__, node->nodeid, node->ipaddr);
        return (node);
    } else {
        //fprintf(stderr, "no nodes\n");
        nspv_log_message("%s no nodes\n", __func__);
    }
    return (0);
}

int32_t havehdr(bits256 blockhash)
{
    for (int32_t i = 0; i < NSPV_num_headers; i++)
        if (bits256_cmp(NSPV_blockheaders[i].blockhash, blockhash) == 0)
            return (i);
    return (-1);
}

int32_t validate_headers(bits256 fromblockhash)
{
    int32_t index, bestindex = 0, counted = 0;
    char str[65];
    bits256 lastblock = fromblockhash;
    while (counted <= NSPV_num_headers) {
        if ((index = havehdr(lastblock)) != -1) {
            lastblock = NSPV_blockheaders[index].hashPrevBlock;
            bestindex = index;
            counted++;
        } else
            break;
    }
    return (bits256_cmp(NSPV_blockheaders[bestindex].blockhash, NSPV_lastntz.blockhash) == 0);
}

int32_t havehdrht(int32_t ht)
{
    for (int32_t i = 0; i < NSPV_num_headers; i++)
        if (NSPV_blockheaders[i].height == ht)
            return (i);
    return (-1);
}

int32_t check_headers(int32_t dispflag)
{
    int32_t esthdrleft = NSPV_inforesult.height - NSPV_lastntz.height - NSPV_num_headers + dispflag;
    return (esthdrleft < 0 ? 0 : esthdrleft);
}

int32_t update_hdr_counter(int32_t start_hdr_height)
{
    return (start_hdr_height >= NSPV_inforesult.height ? (check_headers(0) > NSPV_MAX_BLOCK_HEADERS ? NSPV_inforesult.height - NSPV_MAX_BLOCK_HEADERS : NSPV_lastntz.height) : start_hdr_height + 1);
}

void reset_headers(int32_t new_ntz_height)
{
    struct NSPV_header old_blockheaders[NSPV_MAX_BLOCK_HEADERS];
    for (int32_t i = 0; i < NSPV_num_headers; i++)
        old_blockheaders[i] = NSPV_blockheaders[i];
    int32_t old_num_headers = NSPV_num_headers;
    memset(NSPV_blockheaders, 0, sizeof(*NSPV_blockheaders));
    NSPV_num_headers = 0;
    for (int32_t i = 0; i < old_num_headers; i++) {
        if (old_blockheaders[i].height >= new_ntz_height) {
            NSPV_blockheaders[NSPV_num_headers] = old_blockheaders[i];
            NSPV_num_headers++;
        }
    }
}

int32_t validate_notarization(bits256 notarization, uint32_t timestamp)
{
    int32_t height;
    bits256 blockhash, desttxid;
    int32_t retval = 0;
    if (NSPV_txproofresult.txlen == 0)
        return (0);
    btc_tx* tx = NSPV_txextract(NSPV_txproofresult.tx, NSPV_txproofresult.txlen);
    if (tx == NULL)
        return (0);
    if (bits256_cmp(NSPV_tx_hash(tx), notarization) != 0)
        return (0);
    if (NSPV_notarizationextract(NSPV_client, 1, &height, &blockhash, &desttxid, tx, timestamp) == 0)
        retval = 1;
    btc_tx_free(tx);
    return (retval);
}

void komodo_nSPVresp(btc_node* from, uint8_t* response, int32_t len)
{
    struct NSPV_inforesp I;
    struct NSPV_txproof tmp_txproofresult;
    char str[65], str2[65];
    uint32_t timestamp = (uint32_t)time(NULL);
    const btc_chainparams* chain = from->nodegroup->chainparams;
    int32_t lag;
    //sprintf(NSPV_lastpeer,"nodeid.%d",from->nodeid);
    strcpy(NSPV_lastpeer, from->ipaddr);
    if (len > 0) {
        NSPV_totalrecv += len;
        switch (response[0]) {
        case NSPV_INFORESP:
            I = NSPV_inforesult;
            NSPV_inforesp_purge(&NSPV_inforesult);
            NSPV_rwinforesp(0, &response[1], &NSPV_inforesult, len);
            //nspv_log_message("got info version.%d response %u from.%d size.%d hdrheight.%d \n",NSPV_inforesult.version,timestamp,from->nodeid,len,NSPV_inforesult.hdrheight); // update current height and ntrz status
            bits256 hdrhash = NSPV_hdrhash(&(NSPV_inforesult.H));
            // update node version.
            from->version = NSPV_inforesult.version;
            if (from->version < NSPV_PROTOCOL_VERSION) {
                from->banscore += 11;
                nspv_log_message("[NODE:%i] %s is old version.%d < %d \n", from->nodeid, from->ipaddr, from->version, NSPV_PROTOCOL_VERSION);
                return;
            }
            // insert block header into array
            if (NSPV_inforesult.hdrheight >= NSPV_lastntz.height && havehdr(hdrhash) == -1) {
                // empty half the array to prevent trying to over fill it.
                if (NSPV_num_headers == NSPV_MAX_BLOCK_HEADERS) {
                    nspv_log_message("array of headers is full,clearing before height.%i\n", I.height - (NSPV_MAX_BLOCK_HEADERS >> 1));
                    reset_headers(I.height - (NSPV_MAX_BLOCK_HEADERS >> 1));
                }
                //fprintf(stderr, "added  block.%i\n", NSPV_inforesult.hdrheight);
                NSPV_blockheaders[NSPV_num_headers].height = NSPV_inforesult.hdrheight;
                NSPV_blockheaders[NSPV_num_headers].blockhash = hdrhash;
                NSPV_blockheaders[NSPV_num_headers].hashPrevBlock = NSPV_inforesult.H.hashPrevBlock;
                NSPV_num_headers++;
            }
            if ((lag = I.height - NSPV_inforesult.height) > 0) {
                NSPV_inforesp_purge(&NSPV_inforesult);
                NSPV_inforesult = I;
                if (IS_IN_SYNC == 1 && lag > 2) {
                    from->banscore += lag;
                    nspv_log_message("[NODE:%i] is not in sync lag.%i, banscore.%i\n", from->nodeid, lag, from->banscore);
                }
            } else {
                if (NSPV_inforesult.height > I.height)
                    nspv_log_message("[NODE:%i] ht.%i hdrheight.%i lastntzht.%i esthdrleft.%i\n", from->nodeid, NSPV_inforesult.height, NSPV_inforesult.hdrheight, NSPV_lastntz.height, check_headers(1));
                // fetch the notarization tx to validate it when it arives.
                if (NSPV_lastntz.height < NSPV_inforesult.notarization.height) {
                    static int32_t counter = 0;
                    if (counter < 1)
                        NSPV_txproof(0, NSPV_client, 0, NSPV_inforesult.notarization.txid, -1);
                    counter++;
                    if (counter > 5)
                        counter = 0;
                }
                // if we have enough headers and they validate back to the last notarization update the tiptime/synced chain status
                if (check_headers(0) == 0 && validate_headers(NSPV_inforesult.blockhash) != 0) {
                    //fprintf(stderr, "[NODE:%i] validated header at height.%i \n",from->nodeid, NSPV_inforesult.height);
                    NSPV_tiptime = NSPV_inforesult.H.nTime;
                    IS_IN_SYNC = 1;
                    if (NSPV_inforesult.height > (int32_t)from->bestknownheight)
                        from->bestknownheight = NSPV_inforesult.height;
                    if (NSPV_inforesult.height > NSPV_longestchain) {
                        nspv_log_message(">>>>>>>>>> longestchain.%i fromnode.%i runtime.%us\n", NSPV_inforesult.height, from->nodeid, (uint32_t)time(NULL) - starttime);
                        NSPV_longestchain = NSPV_inforesult.height;
                    }
                } else if (IS_IN_SYNC == 1) {
                    // we dont update the chain tip if it cannot be linked back to last notarization
                    NSPV_inforesp_purge(&NSPV_inforesult);
                    NSPV_inforesult = I;
                    // set in sync false, so we can try and fetch more previous headers to get back in sync.
                    IS_IN_SYNC = 0;
                } else
                    IS_IN_SYNC = 0;
                if (IS_IN_SYNC == 1) {
                    // validate the block header sent is in the main chain.
                    if (validate_headers(hdrhash) == 0) {
                        from->banscore += 1;
                        nspv_log_message("[%s] sent invalid header banscore.%i\n", from->ipaddr, from->banscore);
                    }
                }
            }
            break;
        case NSPV_UTXOSRESP:
            NSPV_utxosresp_purge(&NSPV_utxosresult);
            NSPV_rwutxosresp(0, &response[1], &NSPV_utxosresult);
            nspv_log_message("got utxos response %s %u size.%d numtxos.%d\n", from->ipaddr, timestamp, len, NSPV_utxosresult.numutxos);
            if (NSPV_utxosresult.nodeheight >= NSPV_inforesult.height) {
                NSPV_balance = NSPV_utxosresult.total;
                NSPV_rewards = NSPV_utxosresult.interest;
            }
            break;
        case NSPV_TXIDSRESP:
            NSPV_txidsresp_purge(&NSPV_txidsresult);
            NSPV_rwtxidsresp(0, &response[1], &NSPV_txidsresult);
            nspv_log_message("got txids response %u size.%d %s CC.%d num.%d\n", timestamp, len, NSPV_txidsresult.coinaddr, NSPV_txidsresult.CCflag, NSPV_txidsresult.numtxids);
            break;
        case NSPV_MEMPOOLRESP:
            NSPV_mempoolresp_purge(&NSPV_mempoolresult);
            NSPV_rwmempoolresp(0, &response[1], &NSPV_mempoolresult);
            nspv_log_message("got mempool response %s %u size.%d (%s) CC.%d num.%d memfunc.%d %s/v%d\n", from->ipaddr, timestamp, len, NSPV_mempoolresult.coinaddr, NSPV_mempoolresult.CCflag, NSPV_mempoolresult.numtxids, NSPV_mempoolresult.memfunc, bits256_str(str, NSPV_mempoolresult.txid), NSPV_mempoolresult.vout);
            break;
        case NSPV_NTZSRESP:
            NSPV_ntzsresp_purge(&NSPV_ntzsresult);
            NSPV_rwntzsresp(0, &response[1], &NSPV_ntzsresult);
            if (NSPV_ntzsresp_find(NSPV_ntzsresult.reqheight) == 0)
                NSPV_ntzsresp_add(&NSPV_ntzsresult);
            nspv_log_message("got ntzs response %u size.%d %s prev.%d, %s next.%d\n", timestamp, len, bits256_str(str, NSPV_ntzsresult.prevntz.txid), NSPV_ntzsresult.prevntz.height, bits256_str(str2, NSPV_ntzsresult.nextntz.txid), NSPV_ntzsresult.nextntz.height);
            break;
        case NSPV_NTZSPROOFRESP:
            NSPV_ntzsproofresp_purge(&NSPV_ntzsproofresult);
            NSPV_rwntzsproofresp(0, &response[1], &NSPV_ntzsproofresult);
            if (NSPV_ntzsproof_find(NSPV_ntzsproofresult.prevtxid, NSPV_ntzsproofresult.nexttxid) == 0)
                NSPV_ntzsproof_add(&NSPV_ntzsproofresult);
            nspv_log_message("got ntzproof response %u size.%d prev.%d next.%d\n", timestamp, len, NSPV_ntzsproofresult.common.prevht, NSPV_ntzsproofresult.common.nextht);
            break;
        case NSPV_TXPROOFRESP:
            tmp_txproofresult = NSPV_txproofresult;
            NSPV_txproof_purge(&NSPV_txproofresult);
            NSPV_rwtxproof(0, &response[1], &NSPV_txproofresult);
            if (bits256_nonz(NSPV_txproofresult.txid) != 0) {
                // validate the notarization transaction that was fetched.
                if (bits256_cmp(NSPV_txproofresult.txid, NSPV_inforesult.notarization.txid) == 0) {
                    if (validate_notarization(NSPV_inforesult.notarization.txid, NSPV_inforesult.notarization.timestamp) != 0) {
                        NSPV_lastntz = NSPV_inforesult.notarization;
                        NSPV_hdrheight_counter = NSPV_lastntz.height;
                        reset_headers(NSPV_lastntz.height);
                        nspv_log_message("new notarization at height.%i\n", NSPV_lastntz.height);
                    }
                } else if (NSPV_txproof_find(NSPV_txproofresult.txid, NSPV_txproofresult.height) == 0)
                    NSPV_txproof_add(&NSPV_txproofresult);
            } else
                NSPV_txproofresult = tmp_txproofresult;
            nspv_log_message("got txproof response %u size.%d %s ht.%d\n", timestamp, len, bits256_str(str, NSPV_txproofresult.txid), NSPV_txproofresult.height);
            break;
        case NSPV_SPENTINFORESP:
            NSPV_spentinfo_purge(&NSPV_spentresult);
            NSPV_rwspentinfo(0, &response[1], &NSPV_spentresult);
            nspv_log_message("got spentinfo response %u size.%d\n", timestamp, len);
            break;

        // processing results for cc requests:
        case NSPV_BROADCASTRESP: {
            struct NSPV_broadcastresp* NSPV_broadcastresult_ptr = from->nodegroup->NSPV_broadcastresult_ptr;
            NSPV_broadcast_purge(NSPV_broadcastresult_ptr);
            NSPV_rwbroadcastresp(0, &response[1], NSPV_broadcastresult_ptr);
            nspv_log_message("got broadcast response %u size.%d %s retcode.%d\n", timestamp, len, bits256_str(str, NSPV_broadcastresult_ptr->txid), NSPV_broadcastresult_ptr->retcode);
        } break;
        case NSPV_REMOTERPCRESP: {
            struct NSPV_remoterpcresp* NSPV_remoterpcresult_ptr = from->nodegroup->NSPV_remoterpcresult_ptr;
            NSPV_remoterpc_purge(NSPV_remoterpcresult_ptr);
            NSPV_rwremoterpcresp(0, &response[1], NSPV_remoterpcresult_ptr, len - 1);
            nspv_log_message("got remoterpc response %u size.%d %s\n", timestamp, len, NSPV_remoterpcresult_ptr->method);
        } break;
        default:
            nspv_log_message("unexpected response %02x size.%d at %u\n", response[0], len, timestamp);
            break;
        }
    }
}

cJSON* NSPV_getinfo_req(btc_spv_client* client, int32_t reqht)
{
    uint8_t msg[512];
    int32_t i, iter;
    uint32_t len = 0; //1;
    struct NSPV_inforesp I;
    NSPV_inforesp_purge(&NSPV_inforesult);
    msg[len++] = NSPV_INFO;
    len += iguana_rwnum(1, &msg[len], sizeof(reqht), &reqht);
    for (iter = 0; iter < 3; iter++)
        if (NSPV_req(client, 0, msg, len, NODE_NSPV, msg[0] >> 1) != 0) {
            for (i = 0; i < NSPV_POLLITERS; i++) {
                usleep(NSPV_POLLMICROS);
                if (NSPV_inforesult.height != 0)
                    return (NSPV_getinfo_json(&NSPV_inforesult));
            }
        } else
            sleep(1);
    memset(&I, 0, sizeof(I));
    return (NSPV_getinfo_json(&NSPV_inforesult));
}

cJSON* NSPV_getpeerinfo(btc_spv_client* client)
{
    cJSON* result = cJSON_CreateArray();

    size_t j;
    for (j = 0; j < client->nodegroup->nodes->len; j++) {
        btc_node* node = vector_idx(client->nodegroup->nodes, j);
        if ((node->state & NODE_CONNECTED) == NODE_CONNECTED) {
            char ipaddr[64];
            cJSON* node_json = cJSON_CreateObject();
            expand_ipbits(ipaddr, (uint64_t)((struct sockaddr_in*)&node->addr)->sin_addr.s_addr);
            jaddnum(node_json, "nodeid", (int64_t)node->nodeid);
            jaddnum(node_json, "protocolversion", (uint32_t)node->version);
            jaddstr(node_json, "ipaddress", ipaddr);
            jaddnum(node_json, "port", (int64_t)node->nodegroup->chainparams->default_port);
            jaddnum(node_json, "lastping", (int64_t)node->lastping);
            jaddnum(node_json, "time_started_con", (int64_t)node->time_started_con);
            jaddnum(node_json, "time_last_request", (int64_t)node->time_last_request);
            jaddnum(node_json, "services", (int64_t)node->nServices);
            jaddnum(node_json, "missbehavescore", (int64_t)node->banscore);
            jaddnum(node_json, "bestknownheight", (int64_t)node->bestknownheight);
            jaddi(result, node_json);
        }
    }
    return (result);
}

btc_tx* NSPV_gettx(btc_spv_client* client, bits256 txid, int32_t v, int32_t height)
{
    int32_t retval = 0, isKMD, skipvalidation = 0;
    int64_t extradata = 0;
    int64_t rewardsum = 0;
    btc_tx* tx = NULL;
    cJSON* result = cJSON_CreateObject();
    isKMD = (strcmp(client->chainparams->name, "KMD") == 0);
    if (height == 0)
        height = NSPV_lastntz.height;
    tx = NSPV_gettransaction(client, &retval, isKMD, skipvalidation, v, txid, height, extradata, NSPV_tiptime, &rewardsum);
    return (tx);
}

cJSON* NSPV_gettransaction2(btc_spv_client* client, bits256 txid, int32_t v, int32_t height)
{
    int32_t retval = 0;
    int64_t rewardsum = 0;
    cJSON* result = cJSON_CreateObject();
    btc_tx* tx;

    tx = NSPV_gettx(client, txid, v, height);
    if (tx == NULL) {
        jaddstr(result, "result", "error");
        jaddstr(result, "error", "could not get tx.");
    } else {
        cstring* txhex = btc_tx_to_cstr(tx);
        if (txhex != 0) {
            jaddstr(result, "hex", txhex->str);
            cstr_free(txhex, true);
        } else
            jaddstr(result, "hex", "couldnt decode tx");
        jaddnum(result, "retcode", (int64_t)retval);
        if (rewardsum > 0)
            jaddnum(result, "rewards", (int64_t)rewardsum);
    }
    return (result);
}

uint32_t NSPV_blocktime(btc_spv_client* client, int32_t hdrheight)
{
    uint32_t timestamp;
    struct NSPV_inforesp old = NSPV_inforesult;
    if (hdrheight > 0) {
        NSPV_getinfo_req(client, hdrheight);
        if (NSPV_inforesult.hdrheight == hdrheight) {
            timestamp = NSPV_inforesult.H.nTime;
            NSPV_inforesult = old;
            //fprintf(stderr,"NSPV_blocktime ht.%d -> t%u\n",hdrheight,timestamp);
            return (timestamp);
        }
    }
    NSPV_inforesult = old;
    return (0);
}

cJSON* NSPV_addressutxos(int32_t waitflag, btc_spv_client* client, char* coinaddr, int32_t CCflag, int32_t skipcount, int32_t filter)
{
    cJSON* result = cJSON_CreateObject();
    uint8_t msg[512];
    int32_t i, iter, slen;
    uint32_t len = 0;//1;
    size_t sz;
    //fprintf(stderr,"utxos %s NSPV addr %s\n",coinaddr,NSPV_address.c_str());
    //if ( NSPV_utxosresult.nodeheight >= NSPV_inforesult.height && strcmp(coinaddr,NSPV_utxosresult.coinaddr) == 0 && CCflag == NSPV_utxosresult.CCflag && skipcount == NSPV_utxosresult.skipcount && filter == NSPV_utxosresult.filter )
    //    return(NSPV_utxosresp_json(&NSPV_utxosresult));
    if (skipcount < 0)
        skipcount = 0;
    NSPV_utxosresp_purge(&NSPV_utxosresult);
    if ((sz = btc_base58_decode_check(coinaddr, msg, sizeof(msg))) != 25) {
        jaddstr(result, "result", "error");
        jaddstr(result, "error", "invalid address");
        jaddnum(result, "addrlen", (int64_t)sz);
        jaddstr(result, "lastpeer", NSPV_lastpeer);
        return (result);
    }
    slen = (int32_t)strlen(coinaddr);
    msg[len++] = NSPV_UTXOS;
    msg[len++] = slen;
    memcpy(&msg[len], coinaddr, slen), len += slen;
    msg[len++] = (CCflag != 0);
    len += iguana_rwnum(1, &msg[len], sizeof(skipcount), &skipcount);
    len += iguana_rwnum(1, &msg[len], sizeof(filter), &filter);
    for (iter = 0; iter < 3; iter++)
        if (NSPV_req(client, 0, msg, len, NODE_ADDRINDEX, msg[0] >> 1) != 0) {
            if (waitflag != 0) {
                for (i = 0; i < NSPV_POLLITERS; i++) {
                    usleep(NSPV_POLLMICROS);
                    if ((NSPV_inforesult.height == 0 || NSPV_utxosresult.nodeheight >= NSPV_inforesult.height) && strcmp(coinaddr, NSPV_utxosresult.coinaddr) == 0 && CCflag == NSPV_utxosresult.CCflag)
                        return (NSPV_utxosresp_json(&NSPV_utxosresult));
                }
            } else
                break;
        } else
            sleep(1);
    jaddstr(result, "result", "error");
    jaddstr(result, "error", "timeout");
    jaddstr(result, "lastpeer", NSPV_lastpeer);
    return (result);
}

cJSON* NSPV_addresstxids(int32_t waitflag, btc_spv_client* client, char* coinaddr, int32_t CCflag, int32_t skipcount, int32_t filter)
{
    cJSON* result = cJSON_CreateObject();
    size_t sz;
    uint8_t msg[512];
    int32_t i, iter;
    uint32_t slen, len = 0;//1;
    if (NSPV_txidsresult.nodeheight >= NSPV_inforesult.height && strcmp(coinaddr, NSPV_txidsresult.coinaddr) == 0 && CCflag == NSPV_txidsresult.CCflag && skipcount == NSPV_txidsresult.skipcount)
        return (NSPV_txidsresp_json(&NSPV_txidsresult));
    if (skipcount < 0)
        skipcount = 0;
    NSPV_txidsresp_purge(&NSPV_txidsresult);
    if ((sz = btc_base58_decode_check(coinaddr, msg, sizeof(msg))) != 25)
    //if ( btc_base58_decode((void *)msg,&sz,coinaddr) == 0 || sz != 25 )
    //if ( bitcoin_base58decode(msg,coinaddr) != 25 )
    {
        jaddstr(result, "result", "error");
        jaddstr(result, "error", "invalid address");
        jaddnum(result, "addrlen", (int64_t)sz);
        jaddstr(result, "lastpeer", NSPV_lastpeer);
        return (result);
    }
    slen = (int32_t)strlen(coinaddr);
    msg[len++] = NSPV_TXIDS;
    msg[len++] = slen;
    memcpy(&msg[len], coinaddr, slen), len += slen;
    msg[len++] = (CCflag != 0);
    len += iguana_rwnum(1, &msg[len], sizeof(skipcount), &skipcount);
    len += iguana_rwnum(1, &msg[len], sizeof(filter), &filter);
    //fprintf(stderr,"skipcount.%d\n",skipcount);
    for (iter = 0; iter < 3; iter++)
        if (NSPV_req(client, 0, msg, len, NODE_ADDRINDEX, msg[0] >> 1) != 0) {
            if (waitflag != 0) {
                for (i = 0; i < NSPV_POLLITERS; i++) {
                    usleep(NSPV_POLLMICROS);
                    if ((NSPV_inforesult.height == 0 || NSPV_txidsresult.nodeheight >= NSPV_inforesult.height) && strcmp(coinaddr, NSPV_txidsresult.coinaddr) == 0 && CCflag == NSPV_txidsresult.CCflag)
                        return (NSPV_txidsresp_json(&NSPV_txidsresult));
                }
            } else
                break;
        } else
            sleep(1);
    jaddstr(result, "result", "error");
    jaddstr(result, "error", "timeout");
    jaddstr(result, "lastpeer", NSPV_lastpeer);
    return (result);
}

cJSON* NSPV_mempooltxids(btc_spv_client* client, char* coinaddr, int32_t CCflag, uint8_t memfunc, bits256 txid, int32_t vout)
{
    cJSON* result = cJSON_CreateObject();
    size_t sz;
    uint8_t msg[512];
    char str[65], zeroes[64];
    int32_t i, iter;
    uint32_t slen, len = 0;//1;
    NSPV_mempoolresp_purge(&NSPV_mempoolresult);
    memset(zeroes, 0, sizeof(zeroes));
    if (coinaddr == 0)
        coinaddr = zeroes;
    if (coinaddr[0] != 0 && (sz = btc_base58_decode_check(coinaddr, msg, sizeof(msg))) != 25) {
        jaddstr(result, "result", "error");
        jaddstr(result, "error", "invalid address");
        jaddnum(result, "addrlen", (int64_t)sz);
        jaddstr(result, "lastpeer", NSPV_lastpeer);
        return (result);
    }
    msg[len++] = NSPV_MEMPOOL;
    msg[len++] = (CCflag != 0);
    len += iguana_rwnum(1, &msg[len], sizeof(memfunc), &memfunc);
    len += iguana_rwnum(1, &msg[len], sizeof(vout), &vout);
    len += iguana_rwbignum(1, &msg[len], sizeof(txid), (uint8_t*)&txid);
    slen = (int32_t)strlen(coinaddr);
    msg[len++] = slen;
    memcpy(&msg[len], coinaddr, slen), len += slen;
    //fprintf(stderr,"(%s) func.%d CC.%d %s/v%d len.%d\n",coinaddr,memfunc,CCflag,bits256_str(str,txid),vout,len);
    for (iter = 0; iter < 3; iter++)
        if (NSPV_req(client, 0, msg, len, NODE_NSPV, msg[0] >> 1) != 0) {
            for (i = 0; i < NSPV_POLLITERS; i++) {
                usleep(NSPV_POLLMICROS);
                if (NSPV_mempoolresult.nodeheight >= NSPV_inforesult.height && strcmp(coinaddr, NSPV_mempoolresult.coinaddr) == 0 && CCflag == NSPV_mempoolresult.CCflag && memfunc == NSPV_mempoolresult.memfunc)
                    return (NSPV_mempoolresp_json(&NSPV_mempoolresult));
            }
        } else
            sleep(1);
    jaddstr(result, "result", "error");
    jaddstr(result, "error", "timeout");
    jaddstr(result, "lastpeer", NSPV_lastpeer);
    return (result);
}

int32_t NSPV_coinaddr_inmempool(btc_spv_client* client, char const* logcategory, char* coinaddr, uint8_t CCflag)
{
    NSPV_mempooltxids(client, coinaddr, CCflag, NSPV_MEMPOOL_ADDRESS, zeroid, -1);
    if (NSPV_mempoolresult.txids != 0 && NSPV_mempoolresult.numtxids >= 1 && strcmp(NSPV_mempoolresult.coinaddr, coinaddr) == 0 && NSPV_mempoolresult.CCflag == CCflag) {
        char str[65];
        fprintf(stderr, "found (%s) vout in mempool %s\n", coinaddr, bits256_str(str, NSPV_mempoolresult.txids[0]));
        if (logcategory != 0) {
            // add to logfile
        }
        return (1);
    } else
        return (0);
}

bool NSPV_spentinmempool(btc_spv_client* client, bits256* spenttxidp, int32_t* spentvinip, bits256 txid, int32_t vout)
{
    NSPV_mempooltxids(client, (char*)"", 0, NSPV_MEMPOOL_ISSPENT, txid, vout);
    if (NSPV_mempoolresult.txids != 0 && NSPV_mempoolresult.numtxids == 1 && memcmp(&NSPV_mempoolresult.txid, &txid, sizeof(txid)) == 0) {
        *spenttxidp = NSPV_mempoolresult.txids[0];
        *spentvinip = NSPV_mempoolresult.vindex;
        return (true);
    }
    *spentvinip = -1;
    memset(spenttxidp, 0, sizeof(*spenttxidp));
    return (false);
}

bool NSPV_inmempool(btc_spv_client* client, bits256 txid)
{
    NSPV_mempooltxids(client, (char*)"", 0, NSPV_MEMPOOL_INMEMPOOL, txid, 0);
    if (NSPV_mempoolresult.txids != 0 && NSPV_mempoolresult.numtxids == 1 && memcmp(&NSPV_mempoolresult.txids[0], &txid, sizeof(txid)) == 0)
        return (true);
    else
        return (false);
}

bool NSPV_evalcode_inmempool(btc_spv_client* client, uint8_t evalcode, uint8_t memfunc)
{
    int32_t vout;
    vout = ((uint32_t)memfunc << 8) | evalcode;
    NSPV_mempooltxids(client, (char*)"", 1, NSPV_MEMPOOL_CCEVALCODE, zeroid, vout);
    if (NSPV_mempoolresult.txids != 0 && NSPV_mempoolresult.numtxids >= 1 && NSPV_mempoolresult.vout == vout)
        return (true);
    else
        return (false);
}

cJSON* NSPV_notarizations(btc_spv_client* client, int32_t reqheight)
{
    uint8_t msg[512];
    int32_t i, iter;
    uint32_t len = 0;//1;
    struct NSPV_ntzsresp N, *ptr;
    if ((ptr = NSPV_ntzsresp_find(reqheight)) != 0) {
        fprintf(stderr, "FROM CACHE NSPV_notarizations.%d\n", reqheight);
        NSPV_ntzsresp_purge(&NSPV_ntzsresult);
        NSPV_ntzsresp_copy(&NSPV_ntzsresult, ptr);
        return (NSPV_ntzsresp_json(ptr));
    }
    msg[len++] = NSPV_NTZS;
    len += iguana_rwnum(1, &msg[len], sizeof(reqheight), &reqheight);
    for (iter = 0; iter < 3; iter++)
        if (NSPV_req(client, 0, msg, len, NODE_NSPV, msg[0] >> 1) != 0) {
            for (i = 0; i < NSPV_POLLITERS; i++) {
                usleep(NSPV_POLLMICROS);
                if (NSPV_ntzsresult.reqheight == reqheight)
                    return (NSPV_ntzsresp_json(&NSPV_ntzsresult));
            }
        } else
            sleep(1);
    memset(&N, 0, sizeof(N));
    return (NSPV_ntzsresp_json(&N));
}

cJSON* NSPV_txidhdrsproof(btc_spv_client* client, bits256 prevtxid, bits256 nexttxid)
{
    uint8_t msg[512];
    int32_t i, iter;
    uint32_t len = 0;//1;
    struct NSPV_ntzsproofresp P, *ptr;
    if ((ptr = NSPV_ntzsproof_find(prevtxid, nexttxid)) != 0) {
        NSPV_ntzsproofresp_purge(&NSPV_ntzsproofresult);
        NSPV_ntzsproofresp_copy(&NSPV_ntzsproofresult, ptr);
        return (NSPV_ntzsproof_json(ptr));
    }
    NSPV_ntzsproofresp_purge(&NSPV_ntzsproofresult);
    msg[len++] = NSPV_NTZSPROOF;
    len += iguana_rwbignum(1, &msg[len], sizeof(prevtxid), (uint8_t*)&prevtxid);
    len += iguana_rwbignum(1, &msg[len], sizeof(nexttxid), (uint8_t*)&nexttxid);
    for (iter = 0; iter < 3; iter++)
        if (NSPV_req(client, 0, msg, len, NODE_NSPV, msg[0] >> 1) != 0) {
            for (i = 0; i < NSPV_POLLITERS; i++) {
                usleep(NSPV_POLLMICROS);
                if (memcmp(&NSPV_ntzsproofresult.prevtxid, &prevtxid, sizeof(prevtxid)) == 0 && memcmp(&NSPV_ntzsproofresult.nexttxid, &nexttxid, sizeof(nexttxid)) == 0)
                    return (NSPV_ntzsproof_json(&NSPV_ntzsproofresult));
            }
        } else
            sleep(1);
    fprintf(stderr, "timeout hdrsproof\n");
    memset(&P, 0, sizeof(P));
    return (NSPV_ntzsproof_json(&P));
}

cJSON* NSPV_hdrsproof(btc_spv_client* client, int32_t prevht, int32_t nextht)
{
    bits256 prevtxid, nexttxid;
    NSPV_notarizations(client, prevht);
    prevtxid = NSPV_ntzsresult.prevntz.txid;
    NSPV_notarizations(client, nextht);
    nexttxid = NSPV_ntzsresult.nextntz.txid;
    return (NSPV_txidhdrsproof(client, prevtxid, nexttxid));
}

cJSON* NSPV_txproof(int32_t waitflag, btc_spv_client* client, int32_t vout, bits256 txid, int32_t height)
{
    uint8_t msg[512];
    char str[65];
    int32_t i, iter;
    uint32_t len = 0;//1;
    struct NSPV_txproof P, *ptr;
    if (height > 0 && (ptr = NSPV_txproof_find(txid, height)) != 0) {
        fprintf(stderr, "FROM CACHE NSPV_txproof %s\n", bits256_str(str, txid));
        NSPV_txproof_purge(&NSPV_txproofresult);
        NSPV_txproof_copy(&NSPV_txproofresult, ptr);
        return (NSPV_txproof_json(ptr));
    }
    NSPV_txproof_purge(&NSPV_txproofresult);
    msg[len++] = NSPV_TXPROOF;
    len += iguana_rwnum(1, &msg[len], sizeof(height), &height);
    len += iguana_rwnum(1, &msg[len], sizeof(vout), &vout);
    len += iguana_rwbignum(1, &msg[len], sizeof(txid), (uint8_t*)&txid);
    //fprintf(stderr,"req txproof %s/v%d at height.%d\n",bits256_str(str,txid),vout,height);
    if (height == -1) {
        NSPV_req(client, 0, msg, len, NODE_NSPV, msg[0] >> 1);
        return (0);
    }
    for (iter = 0; iter < 3; iter++)
        if (NSPV_req(client, 0, msg, len, NODE_NSPV, msg[0] >> 1) != 0) {
            if (waitflag != 0) {
                for (i = 0; i < NSPV_POLLITERS; i++) {
                    usleep(NSPV_POLLMICROS);
                    if (memcmp(&NSPV_txproofresult.txid, &txid, sizeof(txid)) == 0)
                        return (NSPV_txproof_json(&NSPV_txproofresult));
                }
            } else
                break;
        } else
            sleep(1);
    fprintf(stderr, "txproof timeout\n");
    memset(&P, 0, sizeof(P));
    return (NSPV_txproof_json(&P));
}

cJSON* NSPV_spentinfo(btc_spv_client* client, bits256 txid, int32_t vout)
{
    uint8_t msg[512];
    int32_t i, iter, len = 0;//1;
    struct NSPV_spentinfo I;
    NSPV_spentinfo_purge(&NSPV_spentresult);
    msg[len++] = NSPV_SPENTINFO;
    len += iguana_rwnum(1, &msg[len], sizeof(vout), &vout);
    len += iguana_rwbignum(1, &msg[len], sizeof(txid), (uint8_t*)&txid);
    for (iter = 0; iter < 3; iter++)
        if (NSPV_req(client, 0, msg, len, NODE_SPENTINDEX, msg[0] >> 1) != 0) {
            for (i = 0; i < NSPV_POLLITERS; i++) {
                usleep(NSPV_POLLMICROS);
                if (memcmp(&NSPV_spentresult.txid, &txid, sizeof(txid)) == 0 && NSPV_spentresult.vout == vout)
                    return (NSPV_spentinfo_json(&NSPV_spentresult));
            }
        } else
            sleep(1);
    memset(&I, 0, sizeof(I));
    return (NSPV_spentinfo_json(&I));
}

cJSON* NSPV_broadcast(btc_spv_client* client, char* hex)
{
    uint8_t *msg, *data;
    bits256 txid;
    int32_t i, n, iter;
    uint32_t len = 0;//3;
    struct NSPV_broadcastresp B;
    struct NSPV_broadcastresp* NSPV_broadcastresult_ptr = client->nodegroup->NSPV_broadcastresult_ptr;

    NSPV_broadcast_purge(NSPV_broadcastresult_ptr);
    n = (int32_t)strlen(hex) >> 1;
    data = (uint8_t*)malloc(n);
    decode_hex(data, n, hex);
    txid = bits256_doublesha256(data, n);
    msg = (uint8_t*)malloc(1 + sizeof(txid) + sizeof(n) + n);
    //msg[0] = msg[1] = msg[2] = 0;
    msg[len++] = NSPV_BROADCAST;
    len += iguana_rwbignum(1, &msg[len], sizeof(txid), (uint8_t*)&txid);
    len += iguana_rwnum(1, &msg[len], sizeof(n), &n);
    memcpy(&msg[len], data, n), len += n;
    free(data);

    //No point in these 8 calls as only the first call would work. The rest 7 calls would not find a node as timestamp == prevtime[ind]:
    //for (i = 0; i < 8; i++)
    //    NSPV_req(client, 0, msg, len, NODE_NSPV, NSPV_BROADCAST >> 1);
    sleep(1);
    for (iter = 0; iter < 3; iter++) {
        if (NSPV_req(client, 0, msg, len, NODE_NSPV, NSPV_BROADCAST >> 1) != 0) {
            for (i = 0; i < NSPV_POLLITERS; i++) {
                usleep(NSPV_POLLMICROS);
                if (memcmp(&NSPV_broadcastresult_ptr->txid, &txid, sizeof(txid)) == 0) {
                    free(msg);
                    return (NSPV_broadcast_json(NSPV_broadcastresult_ptr, txid));
                }
            }
        } else
            sleep(1);
    }
    free(msg);
    memset(&B, 0, sizeof(B));
    B.retcode = -2;
    return (NSPV_broadcast_json(&B, txid));
}

cJSON* NSPV_remoterpccall(btc_spv_client* client, char* method, cJSON* request)
{
    uint8_t* msg;
    uint8_t* pushed_msg;
    int32_t i, iter;
    uint32_t msg_len, jlen, pushed_len;

    char* pubkey = utils_uint8_to_hex(NSPV_pubkey.pubkey, 33);
    nspv_log_message("%s pubkey=%s\n", __func__, pubkey); //TODO: remove

    jaddstr(request, "mypk", pubkey);
    struct NSPV_remoterpcresp* NSPV_remoterpcresult_ptr = client->nodegroup->NSPV_remoterpcresult_ptr;
    NSPV_remoterpc_purge(NSPV_remoterpcresult_ptr);

    char* json = cJSON_Print(request);
    nspv_log_message("%s request json=%p (%s)\n", __func__, json, json ? json : "<NULL>"); // TODO: remove
    if (!json)
        return (NULL);

    /*
    slen = (int32_t)strlen(json);
    if (slen > 254) {
        msg = (uint8_t*)malloc(4 + sizeof(slen) + slen);
        len = 3;
        msg[0] = msg[1] = msg[2] = 0;
        msg[len++] = NSPV_REMOTERPC;
    } else {
        msg = (uint8_t*)malloc(2 + sizeof(slen) + slen);
        msg[0] = 0;
        len = 1;
        msg[len++] = NSPV_REMOTERPC;
    }
    len += iguana_rwnum(1, &msg[len], sizeof(slen), &slen);
    memcpy(&msg[len], json, slen), len += slen;*/

    jlen = (int32_t)strlen(json);
    msg = (uint8_t*)malloc(1 + sizeof(jlen) + jlen);
    msg_len = 0;
    msg[msg_len++] = NSPV_REMOTERPC;
    msg_len += iguana_rwnum(1, &msg[msg_len], sizeof(jlen), &jlen);
    memcpy(&msg[msg_len], json, jlen);
    msg_len += jlen;

    //pushed_msg = NULL;
    //pushed_len = 0;
    //write_compact_size(&pushed_msg, &pushed_len, msg, msg_len);
    free(json);
    //free(msg);
    for (iter = 0; iter < 3; iter++) {
        if (NSPV_req(client, 0, msg, msg_len, NODE_NSPV, NSPV_REMOTERPC >> 1) != 0) {
            for (i = 0; i < NSPV_POLLITERS; i++) {
                usleep(NSPV_POLLMICROS);
                if (strcmp(NSPV_remoterpcresult_ptr->method, method) == 0) {
                    nspv_log_message("%s NSPV_remoterpcresult.json %s\n", __func__, NSPV_remoterpcresult_ptr->json);
                    cJSON* result = cJSON_Parse(NSPV_remoterpcresult_ptr->json);
                    NSPV_remoterpc_purge(NSPV_remoterpcresult_ptr);
                    free(msg);
                    return (result);
                }
            }
        } else
            sleep(1);
    }
    nspv_log_message("%s returning null response\n", __func__);
    free(msg);
    return (NULL);
}

cJSON* NSPV_login(const btc_chainparams* chain, char* wifstr)
{
    cJSON* result = cJSON_CreateObject();
    char coinaddr[64], wif2[64];
    uint8_t data[128];
    int32_t valid = 0;
    size_t sz = 0, sz2;
    bits256 privkey;
    NSPV_logout();
    memset(NSPV_wifstr, 0, sizeof(NSPV_wifstr));
    NSPV_logintime = (uint32_t)time(NULL);
    if (strlen(wifstr) < 64 && (sz = btc_base58_decode_check(wifstr, data, sizeof(data))) > 0 && ((sz == 38 && data[sz - 5] == 1) || (sz == 37 && data[sz - 5] != 1)))
        valid = 1;
    // if error, treat as seed, also get remote working, html needs to use -p=port
    if (valid == 0 || data[0] != chain->b58prefix_secret_address) {
        /*jaddstr(result,"result","error");
        jaddstr(result,"error","invalid wif");
        jaddnum(result,"len",(int64_t)sz);
        jaddnum(result,"wifprefix",(int64_t)data[0]);
        jaddnum(result,"expected",(int64_t)chain->b58prefix_secret_address);
        return(result);*/
        privkey = NSPV_seed_to_wif(NSPV_walletseed, (int32_t)sizeof(NSPV_walletseed) - 1, wifstr);
        memcpy(NSPV_key.privkey, privkey.bytes, sizeof(privkey));
        sz2 = sizeof(wif2);
        btc_privkey_encode_wif(&NSPV_key, chain, wif2, &sz2);
        wifstr = wif2;
        memset(&NSPV_key, 0, sizeof(NSPV_key));
        memset(privkey.bytes, 0, sizeof(privkey));
    }
    if (strcmp(NSPV_wifstr, wifstr) != 0) {
        strncpy(NSPV_wifstr, wifstr, sizeof(NSPV_wifstr) - 1);
        if (btc_privkey_decode_wif(NSPV_wifstr, chain, &NSPV_key) == 0) {
            jaddstr(result, "wiferror", "couldnt decode wif");
            memset(wif2, 0, sizeof(wif2));
            return (result);
        }
        memcpy(privkey.bytes, NSPV_key.privkey, 32);
    }
    memset(wif2, 0, sizeof(wif2));
    jaddstr(result, "result", "success");
    jaddstr(result, "status", "wif will expire in 777 seconds");
    btc_pubkey_from_key(&NSPV_key, &NSPV_pubkey);
    sz2 = sizeof(NSPV_pubkeystr);
    btc_pubkey_get_hex(&NSPV_pubkey, NSPV_pubkeystr, &sz2);
    btc_pubkey_getaddr_p2pkh(&NSPV_pubkey, chain, NSPV_address);
    //jaddstr(result,"seed",NSPV_walletseed);
    jaddstr(result, "address", NSPV_address);
    jaddstr(result, "pubkey", NSPV_pubkeystr);
    jaddnum(result, "wifprefix", (int64_t)data[0]);
    jaddnum(result, "compressed", (int64_t)(data[sz - 5] == 1));
    char* res = jprint(result, 0);
    fprintf(stderr, "result (%s)\n", res);
    free(res);
    memset(data, 0, sizeof(data));
    return (result);
}

bits256 NSPV_bits_to_seed(uint8_t* key, char* lang)
{
    static char *wordptrs[2048], language[64];
    bits256 privkey;
    int32_t ind, i, j, words[23];
    char wordstr[256], fname[64], rawseed[4096];
    FILE* fp;
    if (wordptrs[0] == 0 || strcmp(lang, language) != 0) {
        for (i = 0; i < (int32_t)(sizeof(wordptrs) / sizeof(*wordptrs)); i++)
            if (wordptrs[i] != 0)
                free(wordptrs[i]);
        memset(wordptrs, 0, sizeof(wordptrs));
        strcpy(language, lang);
        sprintf(fname, "seeds/%s.txt", lang);
        if ((fp = fopen(fname, "rb")) != 0) {
            memset(wordstr, 0, sizeof(wordstr));
            i = 0;
            while (OS_getline(1, wordstr, (int32_t)sizeof(wordstr) - 1, 0, fp) > 0)
                wordptrs[i++] = clonestr(wordstr);
            fclose(fp);
        }
    }
    rawseed[0] = 0;
    for (i = 0; i < (int32_t)(sizeof(words) / sizeof(*words)); i++) {
        ind = 0;
        for (j = 0; j < 11; j++)
            if (GETBIT(key, i * 11 + j) != 0)
                SETBIT(&ind, j);
        if (wordptrs[ind] == 0)
            sprintf(wordstr, "%d", ind);
        else
            strcpy(wordstr, wordptrs[ind]);
        words[i] = ind;
        strcat(rawseed, wordstr);
        if (i < (int32_t)(sizeof(words) / sizeof(*words)) - 1)
            strcat(rawseed, " ");
    }
    privkey = NSPV_seed_to_wif(NSPV_tmpseed, (int32_t)sizeof(NSPV_tmpseed) - 1, rawseed);
    if (0) {
        for (i = 0; i < 23; i++)
            for (j = 0; j < 11; j++)
                fprintf(stderr, "%d", GETBIT((uint8_t*)&words[i], j) != 0);
        fprintf(stderr, " words[]\n");
        for (j = 0; j < 256; j++)
            fprintf(stderr, "%d", GETBIT(key, j) != 0);
        fprintf(stderr, " <- (%s)\n", NSPV_tmpseed);
    }
    return (privkey);
}

cJSON* NSPV_setlanguage(char* lang)
{
    cJSON* result = cJSON_CreateObject();
    char fname[512];
    FILE* fp;
    if (lang == 0 || lang[0] == 0 || strlen(lang) >= 64) {
        jaddstr(result, "result", "error");
        jaddstr(result, "error", "no lang");
        return (result);
    }
    sprintf(fname, "seeds/%s.txt", lang);
    if ((fp = fopen(fname, "rb")) == 0) {
        jaddstr(result, "result", "error");
        jaddstr(result, "error", lang);
        jaddstr(result, "status", "cant find language.txt file");
        return (result);
    } else
        fclose(fp);
    strcpy(NSPV_language, lang);
    jaddstr(result, "result", "success");
    jaddstr(result, "language", lang);
    return (result);
}

cJSON* NSPV_addnode(btc_spv_client* client, char* ipaddr)
{
    cJSON* result = cJSON_CreateObject();
    char nodeaddr[128];
    btc_node* node;
    int32_t i, retval = -1;
    if (ipaddr == 0 || ipaddr[0] == 0) {
        jaddstr(result, "result", "error");
        jaddstr(result, "error", "no ipaddr field");
        return (result);
    }
    for (i = 0; ipaddr[i] != 0; i++)
        if (ipaddr[i] == ':')
            break;
    if (ipaddr[i] == ':')
        strncpy(nodeaddr, ipaddr, sizeof(nodeaddr) - 1);
    else
        sprintf(nodeaddr, "%s:%u", ipaddr, client->chainparams->default_port);
    node = btc_node_new();
    if (btc_node_set_ipport(node, nodeaddr) > 0) {
        if (btc_node_group_add_node(client->nodegroup, node) != node) {
            btc_node_free(node);
            retval = 1;
        } else
            retval = 0;
    } else
        btc_node_free(node);
    if (retval < 0) {
        jaddstr(result, "result", "error");
        jaddstr(result, "error", "illegal ipaddr");
    } else {
        jaddstr(result, "result", "success");
        if (retval == 0)
            jaddstr(result, "status", "ipaddr added");
        else
            jaddstr(result, "status", "ipaddr already there");
    }
    jaddstr(result, "ipaddr", nodeaddr);
    return (result);
}

static char* biplangs[] = {"chinese_simplified", "english", "italian", "korean", "spanish", "chinese_traditional", "french", "japanese", "russian"};

int32_t NSPV_bip_lang(char* lang)
{
    int32_t i;
    for (i = 0; i < (int32_t)(sizeof(biplangs) / sizeof(*biplangs)); i++)
        if (strcmp(biplangs[i], lang) == 0)
            return (1);
    return (0);
}

cJSON* NSPV_getnewaddress(const btc_chainparams* chain, char* lang)
{
    static char lastlang[128];
    cJSON* result = cJSON_CreateObject();
    size_t sz;
    btc_key key;
    btc_pubkey pubkey;
    char address[64], pubkeystr[67], wifstr[100];
    bits256 privkey;
    btc_random_bytes(key.privkey, 32, 0);
    if (lang == 0 || lang[0] == 0) {
        if (lastlang[0] == 0) {
            if (NSPV_bip_lang(NSPV_language) > 0)
                lang = NSPV_language;
            else
                lang = "english";
        } else
            lang = lastlang;
    }
    if (lang != lastlang)
        strcpy(lastlang, lang);
    privkey = NSPV_bits_to_seed(key.privkey, lang);
    memcpy(key.privkey, privkey.bytes, sizeof(privkey));

    btc_pubkey_from_key(&key, &pubkey);
    sz = sizeof(pubkeystr);
    btc_pubkey_get_hex(&pubkey, pubkeystr, &sz);
    btc_pubkey_getaddr_p2pkh(&pubkey, chain, address);
    sz = sizeof(wifstr);
    btc_privkey_encode_wif(&key, chain, wifstr, &sz);
    jaddstr(result, "seed", NSPV_tmpseed);
    jaddstr(result, "wif", wifstr);
    jaddstr(result, "address", address);
    jaddstr(result, "pubkey", pubkeystr);
    jaddnum(result, "wifprefix", chain->b58prefix_secret_address);
    jaddnum(result, "compressed", 1);
    memset(wifstr, 0, sizeof(wifstr));
    return (result);
}

int32_t NSPV_periodic(btc_node* node) // called periodically
{
    static uint32_t lasttxproof;
    cJSON* retjson;
    char str[65];
    struct NSPV_utxoresp* up;
    uint8_t msg[512];
    int32_t i, k;
    uint32_t len = 0;//1;
    uint32_t timestamp = (uint32_t)time(NULL), delay;
    btc_spv_client* client = (btc_spv_client*)node->nodegroup->ctx;
    if (NSPV_logintime != 0 && timestamp > NSPV_logintime + NSPV_AUTOLOGOUT)
        NSPV_logout();
    if (node->prevtimes[NSPV_INFO >> 1] > timestamp)
        node->prevtimes[NSPV_INFO >> 1] = 0;

    if (starttime == 0)
        starttime = timestamp;

    if (node->gotaddrs == 0 /*|| timestamp - node->gotaddrs > NSPV_GETADDR_INTERVAL*/) {  // periodical getaddr is needed for kogs cc to get updated nodes table ASAP. 
        // Note that getaddr might time out and cause nspv.exe to shutdown
        // this is because on komodod AddrMan object might be locked for several minutes
        // For getaddr to always return a response a fix is needed on komodod that getaddr did not wait for lock on addrman object but just did TRY_LOCK
        // ---
        // void CAddrMan::GetAddr_(std::vector<CAddress>& vAddr) to use nSPV flag
        cstring* request = btc_p2p_message_new(node->nodegroup->chainparams->netmagic, "getaddr", NULL, 0);
        btc_node_send(node, request);
        cstr_free(request, true);
        // fprintf(stderr,"request addrs\n");
    }
    if (NSPV_address[0] != 0) {
        if (0 && strcmp(NSPV_address, NSPV_utxosresult.coinaddr) != 0 && (NSPV_didfirstutxos == 0 || timestamp > NSPV_didfirstutxos + NSPV_chain->blocktime / 2)) {
            if ((retjson = NSPV_addressutxos(0, NSPV_client, NSPV_address, 0, 0, 0)) != 0) {
                fprintf(stderr, "send first utxos for %s\n", NSPV_address);
                NSPV_didfirstutxos = timestamp;
                free_json(retjson);
            }
        }
        if (0 && strcmp(NSPV_address, NSPV_txidsresult.coinaddr) != 0 && (NSPV_didfirsttxids == 0 || timestamp > NSPV_didfirsttxids + NSPV_chain->blocktime / 2)) {
            if ((retjson = NSPV_addresstxids(0, NSPV_client, NSPV_address, 0, 0, 0)) != 0) {
                fprintf(stderr, "send first txids for %s\n", NSPV_address);
                NSPV_didfirsttxids = timestamp;
                free_json(retjson);
            }
        }
        if (timestamp > lasttxproof && NSPV_didfirsttxproofs > 0 && strcmp(NSPV_address, NSPV_utxosresult.coinaddr) == 0 && NSPV_didfirsttxproofs <= NSPV_utxosresult.numutxos) {
            --NSPV_didfirsttxproofs;
            up = &NSPV_utxosresult.utxos[NSPV_didfirsttxproofs];
            if ((retjson = NSPV_txproof(0, NSPV_client, up->vout, up->txid, up->height)) != 0) {
                fprintf(stderr, "request utxo[%d] %s\n", NSPV_didfirsttxproofs, bits256_str(str, up->txid));
                NSPV_didfirsttxids = timestamp;
                free_json(retjson);
            }
            lasttxproof = timestamp;
            if (NSPV_didfirsttxproofs == 0)
                NSPV_didfirsttxproofs = -1;
        }
    }
    k = node->nodegroup->NSPV_num_connected_nodes < (node->nodegroup->desired_amount_connected_nodes >> 2) ? 2 : 1;
    delay = (client->chainparams->blocktime >> 1) + ((rand() % (client->chainparams->blocktime >> k)) * (IS_IN_SYNC + 1));

    if (IS_IN_SYNC != 0 && timestamp < NSPV_lastgetinfo + 30 && (int32_t)node->bestknownheight > NSPV_longestchain - 2)
        return (0);

    if (timestamp > node->lastgetinfo + delay) {
        int32_t reqht = 0, j = 0, n = 0, p = NSPV_hdrheight_counter;
        static int32_t didinit = 0;
        if (NSPV_lastntz.height > 0 && IS_IN_SYNC == 0) {
            n = NSPV_num_headers + 1;
            do {
                if (didinit == 0) {
                    NSPV_hdrheight_counter = NSPV_lastntz.height;
                    didinit++;
                    break;
                } else {
                    NSPV_hdrheight_counter = update_hdr_counter(NSPV_hdrheight_counter);
                    j++;
                }
                if (j == n) {
                    NSPV_hdrheight_counter = update_hdr_counter(p);
                    break;
                }
            } while (havehdrht(NSPV_hdrheight_counter) >= 0);
            reqht = NSPV_hdrheight_counter;
        } else
            NSPV_lastgetinfo = timestamp;
        nspv_log_message("node.%i reqhdr.%i hdrtotal.%i delay.%u k.%i\n", node->nodeid, reqht, NSPV_num_headers, delay, k);
        len = 0;//1;
        msg[len++] = NSPV_INFO;
        len += iguana_rwnum(1, &msg[len], sizeof(reqht), &reqht);
        node->lastgetinfo = timestamp;
        return (NSPV_req(client, node, msg, len, NODE_NSPV, NSPV_INFO >> 1) != 0);
    }
    return (0);
}

#define NSPV_STR 1
#define NSPV_INT 2
#define NSPV_UINT 3
#define NSPV_HASH 4
#define NSPV_FLOAT 5

struct NSPV_arginfo {
    char field[63];
    uint8_t type;
};

struct NSPV_methodarg {
    char method[64];
    struct NSPV_arginfo args[8];
};

struct NSPV_methodarg NSPV_methods[] =
    {
        {"stop", {"", 0}},
        {"help", {"", 0}},
        {"logout", {"", 0}},
        {"addnode", {"ipaddr", NSPV_STR}},
        {"getnewaddress", {"lang", NSPV_STR}},
        {"getpeerinfo", {"", 0}},
        {"login", {{"wif", NSPV_STR}}},
        {"language", {{"lang", NSPV_STR}}},
        {"broadcast", {{"hex", NSPV_STR}}},
        {"listunspent", {{"address", NSPV_STR}, {"isCC", NSPV_UINT}, {"skipcount", NSPV_UINT}, {"filter", NSPV_UINT}}},
        {"listtransactions", {{"address", NSPV_STR}, {"isCC", NSPV_UINT}, {"skipcount", NSPV_UINT}, {"filter", NSPV_UINT}}},
        {"notarizations", {{"height", NSPV_UINT}}},
        {"hdrsproof", {{"prevheight", NSPV_UINT}, {"nextheight", NSPV_UINT}}},
        {"getinfo", {{"hdrheight", NSPV_UINT}}},
        {"txproof", {{"txid", NSPV_HASH}, {"vout", NSPV_UINT}, {"height", NSPV_UINT}}},
        {"spentinfo", {{"txid", NSPV_HASH}, {"vout", NSPV_UINT}}},
        {"spend", {{"address", NSPV_STR}, {"amount", NSPV_FLOAT}}},
        {"mempool", {
                        {"address", NSPV_STR},
                        {"isCC", NSPV_UINT},
                        {"memfunc", NSPV_UINT},
                        {"txid", NSPV_HASH},
                        {"vout", NSPV_UINT},
                        {"evalcode", NSPV_UINT},
                        {"CCfunc", NSPV_UINT},
                    }},
        {"gettransaction", {{"txid", NSPV_HASH}, {"vout", NSPV_UINT}, {"height", NSPV_UINT}}},
};

cJSON* NSPV_helpitem(struct NSPV_methodarg* ptr)
{
    int32_t i;
    char* str;
    cJSON *item = cJSON_CreateObject(), *obj, *array = cJSON_CreateArray();
    jaddstr(item, "method", ptr->method);
    for (i = 0; i < (int32_t)(sizeof(ptr->args) / sizeof(*ptr->args)); i++) {
        if (ptr->args[i].field[0] == 0)
            break;
        obj = cJSON_CreateObject();
        switch (ptr->args[i].type) {
        case NSPV_STR:
            jaddstr(obj, ptr->args[i].field, "string");
            break;
        case NSPV_INT:
            jaddstr(obj, ptr->args[i].field, "int32_t");
            break;
        case NSPV_UINT:
            jaddstr(obj, ptr->args[i].field, "uint32_t");
            break;
        case NSPV_HASH:
            jaddstr(obj, ptr->args[i].field, "hash");
            break;
        case NSPV_FLOAT:
            jaddstr(obj, ptr->args[i].field, "float");
            break;
        }
        jaddi(array, obj);
    }
    jadd(item, "fields", array);
    return (item);
}

cJSON* NSPV_help()
{
    int32_t i;
    cJSON *retjson = cJSON_CreateObject(), *array = cJSON_CreateArray();
    jaddstr(retjson, "result", "success");
    for (i = 0; i < (int32_t)(sizeof(NSPV_methods) / sizeof(*NSPV_methods)); i++)
        jaddi(array, NSPV_helpitem(&NSPV_methods[i]));
    jadd(retjson, "methods", array);
    jaddnum(retjson, "num", sizeof(NSPV_methods) / sizeof(*NSPV_methods));
    return (retjson);
}

void NSPV_argjson_addfields(char* method, cJSON* argjson, cJSON* params)
{
    int32_t i, j, n, m;
    for (i = 0; i < (int32_t)(sizeof(NSPV_methods) / sizeof(*NSPV_methods)); i++) {
        if (strcmp(method, NSPV_methods[i].method) == 0) {
            for (j = 0; j < (int32_t)(sizeof(NSPV_methods[i].args) / sizeof(*NSPV_methods[i].args)); j++)
                if (NSPV_methods[i].args[j].field[0] == 0)
                    break;
            n = j;
            m = cJSON_GetArraySize(params);
            for (j = 0; j < n; j++) {
                switch (NSPV_methods[i].args[j].type) {
                case NSPV_STR:
                    if (j >= m)
                        jaddstr(argjson, NSPV_methods[i].args[j].field, "");
                    else
                        jaddstr(argjson, NSPV_methods[i].args[j].field, jstri(params, j));
                    break;
                case NSPV_INT:
                    if (j >= m)
                        jaddnum(argjson, NSPV_methods[i].args[j].field, 0);
                    else
                        jaddnum(argjson, NSPV_methods[i].args[j].field, jinti(params, j));
                    break;
                case NSPV_UINT:
                    if (j >= m)
                        jaddnum(argjson, NSPV_methods[i].args[j].field, 0);
                    else
                        jaddnum(argjson, NSPV_methods[i].args[j].field, juinti(params, j));
                    break;
                case NSPV_HASH:
                    if (j >= m)
                        jaddbits256(argjson, NSPV_methods[i].args[j].field, zeroid);
                    else
                        jaddbits256(argjson, NSPV_methods[i].args[j].field, jbits256i(params, j));
                    break;
                case NSPV_FLOAT:
                    if (j >= m)
                        jaddnum(argjson, NSPV_methods[i].args[j].field, 0);
                    else
                        jaddnum(argjson, NSPV_methods[i].args[j].field, jdoublei(params, j));
                    break;
                }
            }
        }
    }
    //fprintf(stderr,"new argjson.(%s)\n",cJSON_Print(argjson));
}

// do not run rpc loop if lib
#if !defined(LIBNSPV_BUILD)
cJSON* NSPV_JSON_process(cJSON* argjson)
{
    char* method;
    bits256 txid;
    int64_t satoshis;
    char *symbol, *coinaddr, *wifstr, *hex;
    int32_t vout, prevheight, nextheight, skipcount, height, hdrheight, numargs;
    uint8_t CCflag, memfunc;
    cJSON *params, *result, *req;

    //fprintf(stderr,"_NEW_JSON.(%s)\n",jprint(argjson,0));
    if ((method = jstr(argjson, "method")) == 0)
        return (cJSON_Parse("{\"error\":\"no method\"}"));
    else if ((symbol = jstr(argjson, "coin")) != 0 && strcmp(symbol, NSPV_symbol) != 0)
        return (cJSON_Parse("{\"error\":\"wrong coin\"}"));
    else if (strcmp("stop", method) == 0) {
        NSPV_STOP_RECEIVED = (uint32_t)time(NULL);
        btc_node_group_shutdown(NSPV_client->nodegroup);
        fprintf(stderr, "shutdown started\n");
        return (cJSON_Parse("{\"result\":\"success\"}"));
    } else if (strcmp("help", method) == 0)
        return (NSPV_help());
    if ((params = jarray(&numargs, argjson, "params")) != 0)
        NSPV_argjson_addfields(method, argjson, params);
    txid = jbits256(argjson, "txid");
    vout = jint(argjson, "vout");
    height = jint(argjson, "height");
    hdrheight = jint(argjson, "hdrheight");
    CCflag = jint(argjson, "isCC");
    memfunc = jint(argjson, "memfunc");
    skipcount = jint(argjson, "skipcount");
    prevheight = jint(argjson, "prevheight");
    nextheight = jint(argjson, "nextheight");
    hex = jstr(argjson, "hex");
    wifstr = jstr(argjson, "wif");
    coinaddr = jstr(argjson, "address");
    satoshis = jdouble(argjson, "amount") * COIN + 0.0000000049;
    if (strcmp(method, "getinfo") == 0)
        return (NSPV_getinfo_req(NSPV_client, hdrheight));
    else if (strcmp(method, "getpeerinfo") == 0)
        return (NSPV_getpeerinfo(NSPV_client));
    else if (strcmp(method, "gettransaction") == 0) {
        if (vout < 0 || memcmp(&zeroid, &txid, sizeof(txid)) == 0)
            return (cJSON_Parse("{\"error\":\"invalid utxo\"}"));
        return (NSPV_gettransaction2(NSPV_client, txid, vout, height));
    } else if (strcmp(method, "logout") == 0) {
        NSPV_logout();
        return (cJSON_Parse("{\"result\":\"success\"}"));
    } else if (strcmp(method, "login") == 0) {
        if (wifstr == 0)
            return (cJSON_Parse("{\"error\":\"no wif\"}"));
        else {
            cJSON* retjson = NSPV_login(NSPV_chain, wifstr);
            memset(wifstr, 0, strlen(wifstr));
            return (retjson);
        }
    } else if (strcmp(method, "addnode") == 0)
        return (NSPV_addnode(NSPV_client, jstr(argjson, "ipaddr")));
    else if (strcmp(method, "getnewaddress") == 0)
        return (NSPV_getnewaddress(NSPV_chain, jstr(argjson, "lang")));
    else if (strcmp(method, "language") == 0)
        return (NSPV_setlanguage(jstr(argjson, "lang")));
    else if (strcmp(method, "broadcast") == 0) {
        if (hex == 0)
            return (cJSON_Parse("{\"error\":\"no hex\"}"));
        else
            return (NSPV_broadcast(NSPV_client, hex));
    } else if (strcmp(method, "listunspent") == 0) {
        if (coinaddr == 0)
            coinaddr = NSPV_address;
        return (NSPV_addressutxos(1, NSPV_client, coinaddr, CCflag, skipcount, 0));
    } else if (strcmp(method, "listtransactions") == 0) {
        if (coinaddr == 0)
            coinaddr = NSPV_address;
        return (NSPV_addresstxids(1, NSPV_client, coinaddr, CCflag, skipcount, 0));
    } else if (strcmp(method, "notarizations") == 0) {
        if (height == 0)
            return (cJSON_Parse("{\"error\":\"no height\"}"));
        else
            return (NSPV_notarizations(NSPV_client, height));
    } else if (strcmp(method, "hdrsproof") == 0) {
        if (prevheight > nextheight || nextheight == 0 || (nextheight - prevheight) > 1440)
            return (cJSON_Parse("{\"error\":\"invalid height range\"}"));
        else
            return (NSPV_hdrsproof(NSPV_client, prevheight, nextheight));
    } else if (strcmp(method, "txproof") == 0) {
        if (vout < 0 || memcmp(&zeroid, &txid, sizeof(txid)) == 0)
            return (cJSON_Parse("{\"error\":\"invalid utxo\"}"));
        else
            return (NSPV_txproof(1, NSPV_client, vout, txid, height));
    } else if (strcmp(method, "spentinfo") == 0) {
        if (vout < 0 || memcmp(&zeroid, &txid, sizeof(txid)) == 0)
            return (cJSON_Parse("{\"error\":\"invalid utxo\"}"));
        else
            return (NSPV_spentinfo(NSPV_client, txid, vout));
    } else if (strcmp(method, "spend") == 0) {
        if (satoshis < 1000 || coinaddr == 0)
            return (cJSON_Parse("{\"error\":\"invalid address or amount too small\"}"));
        else
            return (NSPV_spend(NSPV_client, NSPV_address, coinaddr, satoshis));
    } else if (strcmp(method, "mempool") == 0) {
        if (memfunc == NSPV_MEMPOOL_CCEVALCODE) {
            uint8_t e, f;
            e = juint(argjson, "evalcode");
            f = juint(argjson, "CCfunc");
            vout = ((uint16_t)f << 8) | e;
        }
        return (NSPV_mempooltxids(NSPV_client, coinaddr, CCflag, memfunc, txid, vout));
    } else if ((req = NSPV_remoterpccall(NSPV_client, method, argjson)) != NULL) {
        cJSON* result = jobj(req, "result");
        if (!cJSON_IsNull(result) && cJSON_HasObjectItem(result, "result") && strcmp(jstr(result, "result"), "success") == 0 && (jstr(result, "hex")) != 0 && jobj(result, "SigData") != NULL) {
            char error[NSPV_MAXERRORLEN];
            cstring *hex=FinalizeCCtx(result, error);
            result=cJSON_CreateObject();
            if (hex != NULL)
            {
                jaddstr(result, "result", "success");
                jaddstr(result, "hex", hex->str);
                cstr_free(hex, 1);
            }
            else
            {
                jaddstr(result, "result", "error");
                jaddstr(result, "error", error);
            }
            cJSON_Delete(req);  
            return(result);
        }
        else return (req);
    }
    else
        return(cJSON_Parse("{\"error\":\"invalid method\"}"));
}
#endif // !defined(LIBNSPV_BUILD)

#endif // KOMODO_NSPVSUPERLITE_H
