#ifndef NSPV_CCUTILS_H
#define NSPV_CCUTILS_H

#include "tools/cryptoconditions/include/cryptoconditions.h"
//#include "../include/btc/script.h"

#define CC_MAXVINS 1024

#define EVAL_FAUCET (0xe4)
const char* FaucetCCaddr = "R9zHrofhRbub7ER77B7NrVch3A63R39GuC";
const char* FaucetNormaladdr = "RKQV4oYs4rvxAWx1J43VnT73rSTVtUeckk";
char FaucetCChexstr[67] = {"03682b255c40d0cde8faee381a1a50bbb89980ff24539cb8518e294d3a63cefe12"};
uint8_t FaucetCCpriv[32] = {0xd4, 0x4f, 0xf2, 0x31, 0x71, 0x7d, 0x28, 0x02, 0x4b, 0xc7, 0xdd, 0x71, 0xa0, 0x39, 0xc4, 0xbe, 0x1a, 0xfe, 0xeb, 0xc2, 0x46, 0xda, 0x76, 0xf8, 0x07, 0x53, 0x3d, 0x96, 0xb4, 0xca, 0xa0, 0xe9};

typedef struct _CCSigData {
    struct CC* cond; // pointer to cryptocondition
    uint64_t voutValue;
    cstring* voutScriptPubkey;
    int32_t vini;
    bool isCC;
} CCSigData;


void endiancpy(uint8_t* dest, uint8_t* src, int32_t len)
{
    int32_t i, j = 0;
#if defined(WORDS_BIGENDIAN)
    for (i = 31; i >= 0; i--)
        dest[j++] = src[i];
#else
    memcpy(dest, src, len);
#endif
}

CC* CCNewEval(char* code, int32_t size)
{
    CC* cond = cc_new(CC_Eval);
    cond->code = (uint8_t*)malloc(size);
    memcpy(cond->code, code, size);
    cond->codeLength = size;
    return cond;
}

CC* CCNewThreshold(int t, CC** v, int size)
{
    CC* cond = cc_new(CC_Threshold);
    cond->threshold = t;
    cond->size = size;
    cond->subconditions = (CC**)calloc(size, sizeof(CC*));
    memcpy(cond->subconditions, v, size * sizeof(CC*));
    return cond;
}

static unsigned char* CopyPubKey(uint8_t* pkIn)
{
    unsigned char* pk = (unsigned char*)malloc(33);
    memcpy(pk, pkIn, 33);
    return pk;
}

CC* CCNewSecp256k1(uint8_t* k)
{
    CC* cond = cc_new(CC_Secp256k1);
    cond->publicKey = CopyPubKey(k);
    return cond;
}

CC* MakeCCcond1(uint8_t evalcode, uint8_t* pk)
{
    cstring* ss;
    CC* c[1] = {CCNewSecp256k1(pk)};
    CC** pks = c;
    ss = cstr_new_sz(1);
    ser_varlen(ss, evalcode);
    CC* condCC = CCNewEval(ss->str, ss->len);
    CC* Sig = CCNewThreshold(1, pks, 1);
    CC* v[2] = {condCC, Sig};
    CC* cond = CCNewThreshold(2, v, 2);
    cstr_free(ss, true);
    cc_free(condCC);
    cc_free(Sig);
    cc_free(*pks);
    return cond;
}

CC* MakeCCcond1of2(uint8_t evalcode, uint8_t* pk1, uint8_t* pk2)
{
    cstring* ss;

    CC* c[2] = {CCNewSecp256k1(pk1), CCNewSecp256k1(pk2)};

    CC** pks = c;
    ss = cstr_new_sz(1);
    ser_varlen(ss, evalcode);
    CC* condCC = CCNewEval(ss->str, ss->len);
    CC* Sig = CCNewThreshold(1, pks, 2);
    CC* v[2] = {condCC, Sig};
    CC* cond = CCNewThreshold(2, v, 2);
    cstr_free(ss, true);
    cc_free(condCC);
    cc_free(Sig);
    cc_free(*pks);
    return cond;
}

void SerializeScript(cstring* script, unsigned char* buf, size_t len)
{
    if (len < OP_PUSHDATA1)
        ser_varlen(script, len);
    else if (len <= 0xFF) {
        ser_varlen(script, OP_PUSHDATA1);
        ser_bytes(script, &len, 1);
    } else if (len <= 0xFFFF) {
        ser_varlen(script, OP_PUSHDATA2);
        ser_u16(script, len);
    } else {
        ser_varlen(script, OP_PUSHDATA4);
        ser_u32(script, len);
    }
    ser_bytes(script, buf, len);
    return;
}
cstring* CCPubKey(const CC* cond)
{
    unsigned char buf[1000]; //, ss[1024];
    int32_t n = 0;
    size_t len = cc_conditionBinary(cond, buf);

    cstring* ccpk = cstr_new_sz(len + 24);
    SerializeScript(ccpk, buf, len);
    unsigned char c = OP_CHECKCRYPTOCONDITION;
    ser_bytes(ccpk, &c, 1);

    return ccpk;
}

void CCSig(const CC* cond, cstring* script)
{
    unsigned char buf[10001];
    size_t len = cc_fulfillmentBinary(cond, buf, 10000);
    buf[len++] = SIGHASH_ALL;
    SerializeScript(script, buf, len);
    return;
}

btc_tx_out* MakeCC1vout(uint8_t evalcode, uint64_t nValue, uint8_t* pk)
{
    CC* payoutCond = MakeCCcond1(evalcode, pk);
    btc_tx_out* vout = btc_tx_out_new();
    vout->script_pubkey = CCPubKey(payoutCond);
    vout->value = nValue;
    cc_free(payoutCond);
    return (vout);
}

btc_tx_out* MakeCC1of2vout(uint8_t evalcode, uint64_t nValue, uint8_t* pk1, uint8_t* pk2)
{
    btc_tx_out* vout = btc_tx_out_new();
    CC* payoutCond = MakeCCcond1of2(evalcode, pk1, pk2);
    vout->script_pubkey = CCPubKey(payoutCond);
    vout->value = nValue;
    cc_free(payoutCond);
    return (vout);
}

btc_pubkey* buf2pk(btc_pubkey* pk, uint8_t* buf33)
{
    int32_t i;
    uint8_t* dest;
    pk->compressed = true;
    for (i = 0; i < 33; i++)
        pk->pubkey[i] = buf33[i];
    return (pk);
}

btc_pubkey* CCtxidaddr(btc_spv_client* client, btc_pubkey* pk, char* txidaddr, uint256 txid)
{
    uint8_t buf33[33];
    buf33[0] = 0x02;
    btc_pubkey_init(pk);
    endiancpy(&buf33[1], (uint8_t*)&txid, 32);
    buf2pk(pk, buf33);
    btc_pubkey_getaddr_p2pkh(pk, client->chainparams, txidaddr);
    return (pk);
}

bool IsPayToCryptoCondition(cstring* script)
{
    vector* v = vector_new(sizeof(btc_script_op), btc_script_op_free_cb);
    btc_script_get_ops(script, v);
    for (int i = 0; i < (int32_t)v->len; i++) {
        btc_script_op* op = vector_idx(v, i);
        if (op->op == OP_CHECKCRYPTOCONDITION)
            return true;
    }
    return false;
}

#endif // NSPV_CCUTILS_H
