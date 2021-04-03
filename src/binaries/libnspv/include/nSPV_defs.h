
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

#ifndef KOMODO_NSPV_DEFSH
#define KOMODO_NSPV_DEFSH

#define NSPV_PROTOCOL_VERSION 0x00000003
#define NSPV_MAXPACKETSIZE (4096 * 1024)
#define NSPV_MAXSCRIPTSIZE 10000
#define MAX_TX_SIZE_BEFORE_SAPLING 100000
#define MAX_TX_SIZE_AFTER_SAPLING (2 * MAX_TX_SIZE_BEFORE_SAPLING)
#define NSPV_LOCKTIME_THRESHOLD 500000000
#define NSPV_KOMODO_ENDOFERA 7777777
#define NSPV_KOMODO_MAXMEMPOOLTIME 3600 // affects consensus
#define NSPV_MAX_BLOCK_HEADERS 128
#define NSPV_ENCRYPTED_MAXSIZE 8192
#define NSPV_MAXERRORLEN 256
#define NSPV_GETADDR_INTERVAL 60 // sec

#define NSPV_MAXERRORLEN 256

#include <time.h>
#ifndef __MINGW
#include <pthread.h>
#endif

#include <btc/net.h>
#include <btc/netspv.h>

#ifndef LIBNSPV_API
#if defined(_WIN32)
#ifdef LIBNSPV_BUILD
#define LIBNSPV_API __declspec(dllexport)
#else
#define LIBNSPV_API
#endif
#elif defined(__GNUC__) && defined(LIBNSPV_BUILD)
#define LIBNSPV_API __attribute__((visibility("default")))
#else
#define LIBNSPV_API
#endif
#endif

// bool is normally defined in stdbool.h if it is supported in this gcc ver
#if !defined bool
#define bool int
#endif

union _bits256 { uint8_t bytes[32]; uint16_t ushorts[16]; uint32_t uints[8]; uint64_t ulongs[4]; uint64_t txid; };
typedef union _bits256 bits256;

#define SATOSHIDEN ((uint64_t)100000000)
#define dstr(x) ((double)(x) / SATOSHIDEN)
#define portable_mutex_t pthread_mutex_t
#define portable_mutex_init(ptr) pthread_mutex_init(ptr, NULL)
#define portable_mutex_lock pthread_mutex_lock
#define portable_mutex_unlock pthread_mutex_unlock
#define OS_thread_create pthread_create
#define SETBIT(bits, bitoffset) (((uint8_t*)bits)[(bitoffset) >> 3] |= (1 << ((bitoffset)&7)))
#define GETBIT(bits, bitoffset) (((uint8_t*)bits)[(bitoffset) >> 3] & (1 << ((bitoffset)&7)))
#define CLEARBIT(bits, bitoffset) (((uint8_t*)bits)[(bitoffset) >> 3] &= ~(1 << ((bitoffset)&7)))


struct rpcrequest_info {
    struct rpcrequest_info *next, *prev;
    pthread_t T;
    int32_t sock;
    uint32_t ipbits;
    uint16_t port, pad;
};

#include "komodo_cJSON.h"

#define NODE_NSPV (1 << 30)
#define NODE_ADDRINDEX (1 << 29)
#define NODE_SPENTINDEX (1 << 28)

#define NSPV_POLLITERS 200
#define NSPV_POLLMICROS 50000
#define NSPV_MAXVINS 64
#define NSPV_AUTOLOGOUT 777
#define NSPV_BRANCHID 0x76b809bb

// nSPV defines and struct definitions with serialization and purge functions

#define NSPV_INFO 0x00
#define NSPV_INFORESP 0x01
#define NSPV_UTXOS 0x02
#define NSPV_UTXOSRESP 0x03
#define NSPV_NTZS 0x04
#define NSPV_NTZSRESP 0x05
#define NSPV_NTZSPROOF 0x06
#define NSPV_NTZSPROOFRESP 0x07
#define NSPV_TXPROOF 0x08
#define NSPV_TXPROOFRESP 0x09
#define NSPV_SPENTINFO 0x0a
#define NSPV_SPENTINFORESP 0x0b
#define NSPV_BROADCAST 0x0c
#define NSPV_BROADCASTRESP 0x0d
#define NSPV_TXIDS 0x0e
#define NSPV_TXIDSRESP 0x0f
#define NSPV_MEMPOOL 0x10
#define NSPV_MEMPOOLRESP 0x11
#define NSPV_CCMODULEUTXOS 0x12
#define NSPV_CCMODULEUTXOSRESP 0x13
#define NSPV_MEMPOOL_ALL 0
#define NSPV_MEMPOOL_ADDRESS 1
#define NSPV_MEMPOOL_ISSPENT 2
#define NSPV_MEMPOOL_INMEMPOOL 3
#define NSPV_MEMPOOL_CCEVALCODE 4
#define NSPV_CC_TXIDS 16
#define NSPV_REMOTERPC 0x14
#define NSPV_REMOTERPCRESP 0x15

#define COIN SATOSHIDEN

struct NSPV_equihdr {
    int32_t nVersion;
    bits256 hashPrevBlock;
    bits256 hashMerkleRoot;
    bits256 hashFinalSaplingRoot;
    uint32_t nTime;
    uint32_t nBits;
    bits256 nNonce;
    uint8_t nSolution[1344];
};

struct NSPV_utxoresp {
    bits256 txid;
    int64_t satoshis, extradata;
    int32_t vout, height;
};

struct NSPV_utxosresp {
    struct NSPV_utxoresp* utxos;
    char coinaddr[64];
    int64_t total, interest;
    int32_t nodeheight, skipcount, filter;
    uint16_t numutxos, CCflag;
};

struct NSPV_txidresp {
    bits256 txid;
    int64_t satoshis;
    int32_t vout, height;
};

struct NSPV_txidsresp {
    struct NSPV_txidresp* txids;
    char coinaddr[64];
    int32_t nodeheight, skipcount, filter;
    uint16_t numtxids, CCflag;
};

struct NSPV_mempoolresp {
    bits256* txids;
    char coinaddr[64];
    bits256 txid;
    int32_t nodeheight, vout, vindex;
    uint16_t numtxids;
    uint8_t CCflag, memfunc;
};

struct NSPV_ntz {
    bits256 blockhash, txid, othertxid;
    int32_t height, txidheight;
    uint32_t timestamp;
};

struct NSPV_ntzsresp {
    struct NSPV_ntz prevntz, nextntz;
    int32_t reqheight;
};

struct NSPV_inforesp {
    struct NSPV_ntz notarization;
    bits256 blockhash;
    int32_t height, hdrheight;
    struct NSPV_equihdr H;
    uint32_t version;
};

struct NSPV_txproof {
    bits256 txid;
    int64_t unspentvalue;
    int32_t height, vout, txlen, txprooflen;
    uint8_t *tx, *txproof;
    uint256 hashblock;
};

struct NSPV_ntzproofshared {
    struct NSPV_equihdr* hdrs;
    int32_t prevht, nextht, pad32;
    uint16_t numhdrs, pad16;
};

struct NSPV_ntzsproofresp {
    struct NSPV_ntzproofshared common;
    bits256 prevtxid, nexttxid;
    int32_t prevtxidht, nexttxidht, prevtxlen, nexttxlen;
    uint8_t *prevntz, *nextntz;
};

struct NSPV_MMRproof {
    struct NSPV_ntzproofshared common;
    // tbd
};

struct NSPV_spentinfo {
    struct NSPV_txproof spent;
    bits256 txid;
    int32_t vout, spentvini;
};

struct NSPV_broadcastresp {
    bits256 txid;
    int32_t retcode;
};

struct NSPV_CCmtxinfo {
    struct NSPV_utxosresp U;
    struct NSPV_utxoresp used[NSPV_MAXVINS];
};

struct NSPV_remoterpcresp {
    char method[64];
    char* json;
};

struct NSPV_header {
    int32_t height;
    bits256 blockhash;
    bits256 hashPrevBlock;
};

extern portable_mutex_t NSPV_netmutex;
extern uint32_t NSPV_STOP_RECEIVED, NSPV_logintime;
extern char NSPV_lastpeer[], NSPV_pubkeystr[], NSPV_wifstr[], NSPV_address[];
bits256 NSPV_hdrhash(struct NSPV_equihdr* hdr);

extern int32_t iguana_rwnum(int32_t rwflag, uint8_t* serialized, int32_t len, void* endianedp);
extern int32_t iguana_rwbignum(int32_t rwflag, uint8_t* serialized, int32_t len, uint8_t* endianedp);
extern int32_t NSPV_periodic(btc_node* node);
extern int32_t check_headers(int32_t dispflag);
extern void komodo_nSPVresp(btc_node* from, uint8_t* response, int32_t len);
extern uint32_t NSPV_blocktime(btc_spv_client* client, int32_t hdrheight);
extern int32_t decode_hex(uint8_t* bytes, int32_t n, char* hex);
extern int32_t is_hexstr(char* str, int32_t n);
extern int32_t NSPV_rwequihdr(int32_t rwflag, uint8_t* serialized, struct NSPV_equihdr* ptr, int32_t addlenflag);
extern bits256 NSPV_sapling_sighash(btc_tx* tx, int32_t vini, int64_t spendamount, uint8_t* spendscript, int32_t spendlen);

extern int32_t IS_IN_SYNC;
extern uint32_t NSPV_logintime, NSPV_tiptime;
extern char NSPV_lastpeer[64], NSPV_address[64], NSPV_wifstr[64], NSPV_pubkeystr[67], NSPV_symbol[64];
extern btc_spv_client* NSPV_client;
extern const btc_chainparams* NSPV_chain;

extern btc_key NSPV_key;
extern btc_pubkey NSPV_pubkey;
extern struct NSPV_inforesp NSPV_inforesult;
extern struct NSPV_utxosresp NSPV_utxosresult;
extern struct NSPV_txidsresp NSPV_txidsresult;
extern struct NSPV_mempoolresp NSPV_mempoolresult;
extern struct NSPV_spentinfo NSPV_spentresult;
extern struct NSPV_ntzsresp NSPV_ntzsresult;
extern struct NSPV_ntzsproofresp NSPV_ntzsproofresult;
extern struct NSPV_txproof NSPV_txproofresult;
//extern struct NSPV_broadcastresp NSPV_broadcastresult;  // now stored in nodegroup

extern struct NSPV_ntzsresp NSPV_ntzsresp_cache[NSPV_MAXVINS];
extern struct NSPV_ntzsproofresp NSPV_ntzsproofresp_cache[NSPV_MAXVINS * 2];
extern struct NSPV_txproof NSPV_txproof_cache[NSPV_MAXVINS * 10];

// validation
extern struct NSPV_ntz NSPV_lastntz;
extern struct NSPV_header NSPV_blockheaders[128]; // limitation here is that 100 block history is maximum. no nota for 100 blocks and we cant sync back to the notarizatio, we can wait for the next one.
extern int32_t NSPV_num_headers;
extern int32_t NSPV_hdrheight_counter, NSPV_longestchain;
extern int32_t IS_IN_SYNC;
extern int64_t NSPV_totalsent, NSPV_totalrecv;

cJSON* NSPV_remoterpccall(btc_spv_client* client, char* method, cJSON* request);
cJSON* NSPV_login(const btc_chainparams* chain, char* wifstr);
cJSON* NSPV_broadcast(btc_spv_client* client, char* hex);

const btc_chainparams* NSPV_coinlist_scan(char* symbol, const btc_chainparams* template);
void* NSPV_rpcloop(void* args);

bool NSPV_SignTx(btc_tx* mtx, int32_t vini, int64_t utxovalue, cstring* scriptPubKey, uint32_t nTime);

cstring* FinalizeCCtx(/*btc_spv_client* client,*/ cJSON* txdata, char* errorout /*=NSPV_MAXERRORLEN*/);
btc_tx* btc_tx_decodehex(char* hexstr);
cstring* btc_tx_to_cstr(btc_tx* tx);
void reverse_hexstr(char* str);
void expand_ipbits(char* ipaddr, uint64_t ipbits);  // moved to nSPV_utils.h because of shared use in libnspv.so (with no rpcloop)
int portable_pton(int af, char* src, void* dst);    // moved to nSPV_utils.h

bits256 bits256_rev(bits256 hash);
btc_tx_in* btc_tx_vin(btc_tx* tx, int32_t vini);
btc_tx_out* btc_tx_vout(btc_tx* tx, int32_t v);
void write_compact_size_and_msg(uint8_t **ppmsg, uint32_t *pmsg_len, uint8_t *var, uint64_t var_len);


//void nspv_log_message(const char *format, ...);

#endif // KOMODO_NSPV_DEFSH
