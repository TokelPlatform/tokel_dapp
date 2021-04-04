
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

#ifndef NSPV_SERDES_H
#define NSPV_SERDES_H

#include <nSPV_defs.h>

int32_t iguana_rwnum(int32_t rwflag, uint8_t* serialized, int32_t len, void* endianedp)
{
    int32_t i;
    uint64_t x;
    if (rwflag == 0) {
        x = 0;
        for (i = len - 1; i >= 0; i--) {
            x <<= 8;
            x |= serialized[i];
        }
        switch (len) {
        case 1:
            *(uint8_t*)endianedp = (uint8_t)x;
            break;
        case 2:
            *(uint16_t*)endianedp = (uint16_t)x;
            break;
        case 4:
            *(uint32_t*)endianedp = (uint32_t)x;
            break;
        case 8:
            *(uint64_t*)endianedp = (uint64_t)x;
            break;
        }
    } else {
        x = 0;
        switch (len) {
        case 1:
            x = *(uint8_t*)endianedp;
            break;
        case 2:
            x = *(uint16_t*)endianedp;
            break;
        case 4:
            x = *(uint32_t*)endianedp;
            break;
        case 8:
            x = *(uint64_t*)endianedp;
            break;
        }
        for (i = 0; i < len; i++, x >>= 8)
            serialized[i] = (uint8_t)(x & 0xff);
    }
    return (len);
}

int32_t iguana_rwbignum(int32_t rwflag, uint8_t* serialized, int32_t len, uint8_t* endianedp)
{
    int32_t i;
    if (rwflag == 0) {
        for (i = 0; i < len; i++)
            endianedp[i] = serialized[len - 1 - i];
    } else {
        for (i = 0; i < len; i++)
            serialized[len - 1 - i] = endianedp[i];
    }
    return (len);
}

int32_t iguana_rwbignum2(int32_t rwflag, uint8_t* serialized, int32_t len, uint8_t* endianedp)
{
    int32_t i;
    if (rwflag == 0) {
        for (i = 0; i < len; i++)
            endianedp[i] = serialized[i];
    } else {
        for (i = 0; i < len; i++)
            serialized[i] = endianedp[i];
    }
    return (len);
}

int32_t iguana_rwbuf(int32_t rwflag, uint8_t* serialized, int32_t len, uint8_t* buf)
{
    if (rwflag != 0)
        memcpy(serialized, buf, len);
    else
        memcpy(buf, serialized, len);
    return (len);
}

int32_t NSPV_rwequihdr(int32_t rwflag, uint8_t* serialized, struct NSPV_equihdr* ptr, int32_t addlenflag)
{
    int32_t len = 0;
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->nVersion), &ptr->nVersion);
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->hashPrevBlock), (uint8_t*)&ptr->hashPrevBlock);
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->hashMerkleRoot), (uint8_t*)&ptr->hashMerkleRoot);
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->hashFinalSaplingRoot), (uint8_t*)&ptr->hashFinalSaplingRoot);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->nTime), &ptr->nTime);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->nBits), &ptr->nBits);
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->nNonce), (uint8_t*)&ptr->nNonce);
    if (addlenflag != 0 && rwflag == 1) {
        serialized[len++] = 0xfd;
        serialized[len++] = 1344 & 0xff;
        serialized[len++] = (1344 >> 8) & 0xff;
    }
    len += iguana_rwbuf(rwflag, &serialized[len], sizeof(ptr->nSolution), ptr->nSolution);
    return (len);
}

int32_t iguana_rwequihdrvec(int32_t rwflag, uint8_t* serialized, uint16_t* vecsizep, struct NSPV_equihdr** ptrp)
{
    int32_t i, vsize, len = 0;
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(*vecsizep), vecsizep);
    if ((vsize = *vecsizep) != 0) {
        //fprintf(stderr,"vsize.%d ptrp.%p alloc %ld\n",vsize,*ptrp,sizeof(struct NSPV_equihdr)*vsize);
        if (*ptrp == 0)
            *ptrp = (struct NSPV_equihdr*)calloc(sizeof(struct NSPV_equihdr), vsize); // relies on uint16_t being "small" to prevent mem exhaustion
        for (i = 0; i < vsize; i++)
            len += NSPV_rwequihdr(rwflag, &serialized[len], &(*ptrp)[i], 0);
    }
    return (len);
}

int32_t iguana_rwuint8vec(int32_t rwflag, uint8_t* serialized, int32_t* biglenp, uint8_t** ptrp)
{
    int32_t vsize, len = 0;
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(*biglenp), biglenp);
    if ((vsize = *biglenp) > 0 && vsize < MAX_TX_SIZE_AFTER_SAPLING) //coin->maxtxsize )
    {
        if (*ptrp == 0)
            *ptrp = (uint8_t*)calloc(1, vsize);
        len += iguana_rwbuf(rwflag, &serialized[len], vsize, *ptrp);
    }
    return (len);
}

int32_t NSPV_rwutxoresp(int32_t rwflag, uint8_t* serialized, struct NSPV_utxoresp* ptr)
{
    int32_t len = 0;
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->txid), (uint8_t*)&ptr->txid);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->satoshis), &ptr->satoshis);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->extradata), &ptr->extradata);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->vout), &ptr->vout);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->height), &ptr->height);
    return (len);
}

int32_t NSPV_rwutxosresp(int32_t rwflag, uint8_t* serialized, struct NSPV_utxosresp* ptr) // check mempool
{
    int32_t i, len = 0;
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->numutxos), &ptr->numutxos);
    if (ptr->numutxos != 0) {
        if (ptr->utxos == 0)
            ptr->utxos = (struct NSPV_utxoresp*)calloc(sizeof(*ptr->utxos), ptr->numutxos); // relies on uint16_t being "small" to prevent mem exhaustion
        for (i = 0; i < ptr->numutxos; i++)
            len += NSPV_rwutxoresp(rwflag, &serialized[len], &ptr->utxos[i]);
    }
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->total), &ptr->total);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->interest), &ptr->interest);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->nodeheight), &ptr->nodeheight);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->filter), &ptr->filter);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->CCflag), &ptr->CCflag);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->skipcount), &ptr->skipcount);
    if (rwflag != 0) {
        memcpy(&serialized[len], ptr->coinaddr, sizeof(ptr->coinaddr));
        len += sizeof(ptr->coinaddr);
    } else {
        memcpy(ptr->coinaddr, &serialized[len], sizeof(ptr->coinaddr));
        len += sizeof(ptr->coinaddr);
    }
    return (len);
}

void NSPV_utxosresp_purge(struct NSPV_utxosresp* ptr)
{
    if (ptr != 0) {
        if (ptr->utxos != 0)
            free(ptr->utxos);
        memset(ptr, 0, sizeof(*ptr));
    }
}

void NSPV_utxosresp_copy(struct NSPV_utxosresp* dest, struct NSPV_utxosresp* ptr)
{
    *dest = *ptr;
    if (ptr->utxos != 0) {
        dest->utxos = (struct NSPV_utxoresp*)malloc(ptr->numutxos * sizeof(*ptr->utxos));
        memcpy(dest->utxos, ptr->utxos, ptr->numutxos * sizeof(*ptr->utxos));
    }
}

int32_t NSPV_rwtxidresp(int32_t rwflag, uint8_t* serialized, struct NSPV_txidresp* ptr)
{
    int32_t len = 0;
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->txid), (uint8_t*)&ptr->txid);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->satoshis), &ptr->satoshis);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->vout), &ptr->vout);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->height), &ptr->height);
    return (len);
}

int32_t NSPV_rwtxidsresp(int32_t rwflag, uint8_t* serialized, struct NSPV_txidsresp* ptr)
{
    int32_t i, len = 0;
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->numtxids), &ptr->numtxids);
    if (ptr->numtxids != 0) {
        if (ptr->txids == 0)
            ptr->txids = (struct NSPV_txidresp*)calloc(sizeof(*ptr->txids), ptr->numtxids);
        for (i = 0; i < ptr->numtxids; i++)
            len += NSPV_rwtxidresp(rwflag, &serialized[len], &ptr->txids[i]);
    }
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->nodeheight), &ptr->nodeheight);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->filter), &ptr->filter);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->CCflag), &ptr->CCflag);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->skipcount), &ptr->skipcount);
    if (rwflag != 0) {
        memcpy(&serialized[len], ptr->coinaddr, sizeof(ptr->coinaddr));
        len += sizeof(ptr->coinaddr);
    } else {
        memcpy(ptr->coinaddr, &serialized[len], sizeof(ptr->coinaddr));
        len += sizeof(ptr->coinaddr);
    }
    //fprintf(stderr,"rwlen.%d\n",len);
    return (len);
}

void NSPV_txidsresp_purge(struct NSPV_txidsresp* ptr)
{
    if (ptr != 0) {
        if (ptr->txids != 0)
            free(ptr->txids);
        memset(ptr, 0, sizeof(*ptr));
    }
}

void NSPV_txidsresp_copy(struct NSPV_txidsresp* dest, struct NSPV_txidsresp* ptr)
{
    *dest = *ptr;
    if (ptr->txids != 0) {
        dest->txids = (struct NSPV_txidresp*)malloc(ptr->numtxids * sizeof(*ptr->txids));
        memcpy(dest->txids, ptr->txids, ptr->numtxids * sizeof(*ptr->txids));
    }
}

int32_t NSPV_rwmempoolresp(int32_t rwflag, uint8_t* serialized, struct NSPV_mempoolresp* ptr)
{
    int32_t i, len = 0;
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->numtxids), &ptr->numtxids);
    if (ptr->numtxids != 0) {
        if (ptr->txids == 0)
            ptr->txids = (bits256*)calloc(sizeof(*ptr->txids), ptr->numtxids);
        for (i = 0; i < ptr->numtxids; i++)
            len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->txids[i]), (uint8_t*)&ptr->txids[i]);
    }
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->txid), (uint8_t*)&ptr->txid);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->nodeheight), &ptr->nodeheight);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->vout), &ptr->vout);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->vindex), &ptr->vindex);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->CCflag), &ptr->CCflag);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->memfunc), &ptr->memfunc);
    if (rwflag != 0) {
        memcpy(&serialized[len], ptr->coinaddr, sizeof(ptr->coinaddr));
        len += sizeof(ptr->coinaddr);
    } else {
        memcpy(ptr->coinaddr, &serialized[len], sizeof(ptr->coinaddr));
        len += sizeof(ptr->coinaddr);
    }
    //fprintf(stderr,"NSPV_rwmempoolresp rwlen.%d\n",len);
    return (len);
}

void NSPV_mempoolresp_purge(struct NSPV_mempoolresp* ptr)
{
    if (ptr != 0) {
        if (ptr->txids != 0)
            free(ptr->txids);
        memset(ptr, 0, sizeof(*ptr));
    }
}

void NSPV_mempoolresp_copy(struct NSPV_mempoolresp* dest, struct NSPV_mempoolresp* ptr)
{
    *dest = *ptr;
    if (ptr->txids != 0) {
        dest->txids = (bits256*)malloc(ptr->numtxids * sizeof(*ptr->txids));
        memcpy(dest->txids, ptr->txids, ptr->numtxids * sizeof(*ptr->txids));
    }
}

int32_t NSPV_rwntz(int32_t rwflag, uint8_t* serialized, struct NSPV_ntz* ptr)
{
    int32_t len = 0;
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->blockhash), (uint8_t*)&ptr->blockhash);
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->txid), (uint8_t*)&ptr->txid);
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->othertxid), (uint8_t*)&ptr->othertxid);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->height), &ptr->height);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->txidheight), &ptr->txidheight);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->timestamp), &ptr->timestamp);
    return (len);
}

int32_t NSPV_rwntzsresp(int32_t rwflag, uint8_t* serialized, struct NSPV_ntzsresp* ptr)
{
    int32_t len = 0;
    len += NSPV_rwntz(rwflag, &serialized[len], &ptr->prevntz);
    len += NSPV_rwntz(rwflag, &serialized[len], &ptr->nextntz);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->reqheight), &ptr->reqheight);
    return (len);
}

void NSPV_ntzsresp_copy(struct NSPV_ntzsresp* dest, struct NSPV_ntzsresp* ptr)
{
    *dest = *ptr;
}

void NSPV_ntzsresp_purge(struct NSPV_ntzsresp* ptr)
{
    if (ptr != 0)
        memset(ptr, 0, sizeof(*ptr));
}

int32_t NSPV_rwinforesp(int32_t rwflag, uint8_t* serialized, struct NSPV_inforesp* ptr, int32_t maxlen)
{
    int32_t len = 0;
    len += NSPV_rwntz(rwflag, &serialized[len], &ptr->notarization);
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->blockhash), (uint8_t*)&ptr->blockhash);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->height), &ptr->height);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->hdrheight), &ptr->hdrheight);
    len += NSPV_rwequihdr(rwflag, &serialized[len], &ptr->H, 0);
    if ((int32_t)(len + sizeof(ptr->version)) > maxlen) {
        if (rwflag == 0)
            ptr->version = 0;
    } else
        len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->version), &ptr->version);
    return (len);
}

void NSPV_inforesp_purge(struct NSPV_inforesp* ptr)
{
    if (ptr != 0)
        memset(ptr, 0, sizeof(*ptr));
}

int32_t NSPV_rwtxproof(int32_t rwflag, uint8_t* serialized, struct NSPV_txproof* ptr)
{
    int32_t len = 0;
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->txid), (uint8_t*)&ptr->txid);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->unspentvalue), &ptr->unspentvalue);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->height), &ptr->height);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->vout), &ptr->vout);
    len += iguana_rwuint8vec(rwflag, &serialized[len], &ptr->txlen, &ptr->tx);
    len += iguana_rwuint8vec(rwflag, &serialized[len], &ptr->txprooflen, &ptr->txproof);
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->hashblock), (uint8_t*)&ptr->hashblock);
    return (len);
}

void NSPV_txproof_copy(struct NSPV_txproof* dest, struct NSPV_txproof* ptr)
{
    *dest = *ptr;
    if (ptr->tx != 0 && ptr->txlen < MAX_TX_SIZE_AFTER_SAPLING) //coin->maxtxsize )
    {
        dest->tx = (uint8_t*)malloc(ptr->txlen);
        memcpy(dest->tx, ptr->tx, ptr->txlen);
    }
    if (ptr->txproof != 0) {
        dest->txproof = (uint8_t*)malloc(ptr->txprooflen);
        memcpy(dest->txproof, ptr->txproof, ptr->txprooflen);
    }
}

void NSPV_txproof_purge(struct NSPV_txproof* ptr)
{
    if (ptr != 0) {
        if (ptr->tx != 0)
            free(ptr->tx);
        if (ptr->txproof != 0)
            free(ptr->txproof);
        memset(ptr, 0, sizeof(*ptr));
    }
}

int32_t NSPV_rwntzproofshared(int32_t rwflag, uint8_t* serialized, struct NSPV_ntzproofshared* ptr)
{
    int32_t len = 0;
    len += iguana_rwequihdrvec(rwflag, &serialized[len], &ptr->numhdrs, &ptr->hdrs);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->prevht), &ptr->prevht);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->nextht), &ptr->nextht);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->pad32), &ptr->pad32);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->pad16), &ptr->pad16);
    //fprintf(stderr,"rwcommon prev.%d next.%d\n",ptr->prevht,ptr->nextht);
    return (len);
}

int32_t NSPV_rwntzsproofresp(int32_t rwflag, uint8_t* serialized, struct NSPV_ntzsproofresp* ptr)
{
    int32_t len = 0;
    len += NSPV_rwntzproofshared(rwflag, &serialized[len], &ptr->common);
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->prevtxid), (uint8_t*)&ptr->prevtxid);
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->nexttxid), (uint8_t*)&ptr->nexttxid);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->prevtxidht), &ptr->prevtxidht);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->nexttxidht), &ptr->nexttxidht);
    len += iguana_rwuint8vec(rwflag, &serialized[len], &ptr->prevtxlen, &ptr->prevntz);
    len += iguana_rwuint8vec(rwflag, &serialized[len], &ptr->nexttxlen, &ptr->nextntz);
    //fprintf(stderr,"retlen.%d\n",len);
    return (len);
}

void NSPV_ntzsproofresp_copy(struct NSPV_ntzsproofresp* dest, struct NSPV_ntzsproofresp* ptr)
{
    *dest = *ptr;
    if (ptr->common.hdrs != 0) {
        dest->common.hdrs = (struct NSPV_equihdr*)malloc(ptr->common.numhdrs * sizeof(*ptr->common.hdrs));
        memcpy(dest->common.hdrs, ptr->common.hdrs, ptr->common.numhdrs * sizeof(*ptr->common.hdrs));
    }
    if (ptr->prevntz != 0) {
        dest->prevntz = (uint8_t*)malloc(ptr->prevtxlen);
        memcpy(dest->prevntz, ptr->prevntz, ptr->prevtxlen);
    }
    if (ptr->nextntz != 0) {
        dest->nextntz = (uint8_t*)malloc(ptr->nexttxlen);
        memcpy(dest->nextntz, ptr->nextntz, ptr->nexttxlen);
    }
}

void NSPV_ntzsproofresp_purge(struct NSPV_ntzsproofresp* ptr)
{
    if (ptr != 0) {
        if (ptr->common.hdrs != 0)
            free(ptr->common.hdrs);
        if (ptr->prevntz != 0)
            free(ptr->prevntz);
        if (ptr->nextntz != 0)
            free(ptr->nextntz);
        memset(ptr, 0, sizeof(*ptr));
    }
}

int32_t NSPV_rwspentinfo(int32_t rwflag, uint8_t* serialized, struct NSPV_spentinfo* ptr) // check mempool
{
    int32_t len = 0;
    len += NSPV_rwtxproof(rwflag, &serialized[len], &ptr->spent);
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->txid), (uint8_t*)&ptr->txid);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->vout), &ptr->vout);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->spentvini), &ptr->spentvini);
    return (len);
}

void NSPV_spentinfo_purge(struct NSPV_spentinfo* ptr)
{
    if (ptr != 0) {
        NSPV_txproof_purge(&ptr->spent);
        memset(ptr, 0, sizeof(*ptr));
    }
}

int32_t NSPV_rwbroadcastresp(int32_t rwflag, uint8_t* serialized, struct NSPV_broadcastresp* ptr)
{
    int32_t len = 0;
    len += iguana_rwbignum(rwflag, &serialized[len], sizeof(ptr->txid), (uint8_t*)&ptr->txid);
    len += iguana_rwnum(rwflag, &serialized[len], sizeof(ptr->retcode), &ptr->retcode);
    return (len);
}

void NSPV_broadcast_purge(struct NSPV_broadcastresp* ptr)
{
    if (ptr != 0)
        memset(ptr, 0, sizeof(*ptr));
}

int32_t NSPV_rwremoterpcresp(int32_t rwflag, uint8_t* serialized, struct NSPV_remoterpcresp* ptr, int32_t slen)
{
    int32_t len = 0;
    len += iguana_rwbuf(rwflag, &serialized[len], sizeof(ptr->method), (uint8_t*)ptr->method);
    ptr->json = calloc(slen - len + 1, sizeof(char));
    len += iguana_rwbuf(rwflag, &serialized[len], slen - len, (uint8_t*)ptr->json);
    return (len);
}

void NSPV_remoterpc_purge(struct NSPV_remoterpcresp* ptr)
{
    if (ptr != 0) {
        if (ptr->json)
            free(ptr->json);
        memset(ptr, 0, sizeof(*ptr));
    }
}

cJSON* NSPV_txproof_json(struct NSPV_txproof* ptr)
{
    char* hexstr;
    cJSON* result = cJSON_CreateObject();
    jaddbits256(result, "txid", ptr->txid);
    jaddnum(result, "height", ptr->height);
    jaddnum(result, "txlen", ptr->txlen);
    jaddnum(result, "txprooflen", ptr->txprooflen);
    hexstr = malloc((ptr->txlen + ptr->txprooflen) * 2 + 4);
    utils_bin_to_hex(ptr->tx, ptr->txlen, hexstr);
    jaddstr(result, "hex", hexstr);
    utils_bin_to_hex(ptr->txproof, ptr->txprooflen, hexstr);
    jaddstr(result, "proof", hexstr);
    jaddstr(result, "lastpeer", NSPV_lastpeer);
    return (result);
}

cJSON* NSPV_spentinfo_json(struct NSPV_spentinfo* ptr)
{
    cJSON* result = cJSON_CreateObject();
    jaddstr(result, "result", "success");
    jaddbits256(result, "txid", ptr->txid);
    jaddnum(result, "vout", ptr->vout);
    jaddnum(result, "spentheight", ptr->spent.height);
    jaddbits256(result, "spenttxid", ptr->spent.txid);
    jaddnum(result, "spentvini", ptr->spentvini);
    jaddnum(result, "spenttxlen", ptr->spent.txlen);
    jaddnum(result, "spenttxprooflen", ptr->spent.txprooflen);
    jaddstr(result, "lastpeer", NSPV_lastpeer);
    return (result);
}

cJSON* NSPV_ntz_json(struct NSPV_ntz* ptr)
{
    cJSON* result = cJSON_CreateObject();
    jaddnum(result, "notarized_height", ptr->height);
    jaddbits256(result, "notarized_blockhash", ptr->blockhash);
    jaddbits256(result, "notarization_txid", ptr->txid);
    jaddnum(result, "notarization_txidheight", ptr->txidheight);
    jaddbits256(result, "notarization_desttxid", ptr->othertxid);
    return (result);
}

cJSON* NSPV_header_json(struct NSPV_equihdr* hdr, int32_t height)
{
    cJSON* item = cJSON_CreateObject();
    jaddnum(item, "height", height);
    jaddbits256(item, "blockhash", NSPV_hdrhash(hdr));
    jaddbits256(item, "hashPrevBlock", hdr->hashPrevBlock);
    jaddbits256(item, "hashMerkleRoot", hdr->hashMerkleRoot);
    jaddnum(item, "nTime", hdr->nTime);
    jaddnum(item, "nBits", hdr->nBits);
    return (item);
}

cJSON* NSPV_headers_json(struct NSPV_equihdr* hdrs, int32_t numhdrs, int32_t height)
{
    int32_t i;
    cJSON* array = cJSON_CreateArray();
    for (i = 0; i < numhdrs; i++)
        jaddi(array, NSPV_header_json(&hdrs[i], height + i));
    return (array);
}

cJSON* NSPV_getinfo_json(struct NSPV_inforesp* ptr)
{
    cJSON* result = cJSON_CreateObject();
    int32_t expiration;
    uint32_t timestamp = (uint32_t)time(NULL);
    jaddstr(result, "result", "success");
    jaddstr(result, "nSPV", "superlite");
    jaddnum(result, "totalsent", NSPV_totalsent);
    jaddnum(result, "totalreceived", NSPV_totalrecv);
    if (NSPV_address[0] != 0) {
        jaddstr(result, "address", NSPV_address);
        jaddstr(result, "pubkey", NSPV_pubkeystr);
    }
    if (NSPV_logintime != 0) {
        expiration = (NSPV_logintime + NSPV_AUTOLOGOUT - timestamp);
        jaddnum(result, "wifexpires", expiration);
    }
    jaddnum(result, "height", ptr->height);
    jaddnum(result, "longestchain", NSPV_longestchain);
    jaddbits256(result, "chaintip", ptr->blockhash);
    jadd(result, "notarization", NSPV_ntz_json(&ptr->notarization));
    jadd(result, "header", NSPV_header_json(&ptr->H, ptr->hdrheight));
    jaddnum(result, "protocolversion", ptr->version);
    jaddstr(result, "lastpeer", NSPV_lastpeer);
    if (IS_IN_SYNC == 1)
        jaddstr(result, "sync_status", "synced");
    else {
        jaddstr(result, "sync_status", "not_synced");
        jaddnum(result, "estimated_headers_left", check_headers(1));
    }

    return (result);
}

cJSON* NSPV_utxoresp_json(struct NSPV_utxoresp* utxos, int32_t numutxos)
{
    int32_t i;
    cJSON *item, *array = cJSON_CreateArray();
    for (i = 0; i < numutxos; i++) {
        item = cJSON_CreateObject();
        jaddnum(item, "height", utxos[i].height);
        jaddbits256(item, "txid", utxos[i].txid);
        jaddnum(item, "vout", utxos[i].vout);
        jaddnum(item, "value", (double)utxos[i].satoshis / COIN);
        jaddnum(item, "rewards", (double)utxos[i].extradata / COIN);
        jaddi(array, item);
    }
    return (array);
}

cJSON* NSPV_utxosresp_json(struct NSPV_utxosresp* ptr)
{
    cJSON* result = cJSON_CreateObject();
    jaddstr(result, "result", "success");
    jadd(result, "utxos", NSPV_utxoresp_json(ptr->utxos, ptr->numutxos));
    jaddstr(result, "address", ptr->coinaddr);
    jaddnum(result, "isCC", ptr->CCflag);
    jaddnum(result, "height", ptr->nodeheight);
    jaddnum(result, "numutxos", ptr->numutxos);
    jaddnum(result, "balance", (double)ptr->total / COIN);
    jaddnum(result, "rewards", (double)ptr->interest / COIN);
    jaddnum(result, "skipcount", ptr->skipcount);
    jaddnum(result, "filter", ptr->filter);
    jaddstr(result, "lastpeer", NSPV_lastpeer);
    return (result);
}

cJSON* NSPV_txidresp_json(struct NSPV_txidresp* txids, int32_t numutxos)
{
    int32_t i;
    cJSON *item, *array = cJSON_CreateArray();
    for (i = 0; i < numutxos; i++) {
        item = cJSON_CreateObject();
        jaddnum(item, "height", txids[i].height);
        jaddbits256(item, "txid", txids[i].txid);
        jaddnum(item, "value", (double)txids[i].satoshis / COIN);
        if (txids[i].satoshis > 0)
            jaddnum(item, "vout", txids[i].vout);
        else
            jaddnum(item, "vin", txids[i].vout);
        jaddi(array, item);
    }
    return (array);
}

cJSON* NSPV_txidsresp_json(struct NSPV_txidsresp* ptr)
{
    cJSON* result = cJSON_CreateObject();
    jaddstr(result, "result", "success");
    jadd(result, "txids", NSPV_txidresp_json(ptr->txids, ptr->numtxids));
    jaddstr(result, "address", ptr->coinaddr);
    jaddnum(result, "isCC", ptr->CCflag);
    jaddnum(result, "height", ptr->nodeheight);
    jaddnum(result, "numtxids", ptr->numtxids);
    jaddnum(result, "skipcount", ptr->skipcount);
    jaddnum(result, "filter", ptr->filter);
    jaddstr(result, "lastpeer", NSPV_lastpeer);
    return (result);
}

cJSON* NSPV_mempoolresp_json(struct NSPV_mempoolresp* ptr)
{
    int32_t i;
    cJSON *result = cJSON_CreateObject(), *array = cJSON_CreateArray();
    jaddstr(result, "result", "success");
    for (i = 0; i < ptr->numtxids; i++)
        jaddibits256(array, ptr->txids[i]);
    jadd(result, "txids", array);
    jaddstr(result, "address", ptr->coinaddr);
    jaddnum(result, "isCC", ptr->CCflag);
    jaddnum(result, "height", ptr->nodeheight);
    jaddnum(result, "numtxids", ptr->numtxids);
    jaddbits256(result, "txid", ptr->txid);
    jaddnum(result, "vout", ptr->vout);
    jaddnum(result, "memfunc", ptr->memfunc);
    switch (ptr->memfunc) {
    case NSPV_MEMPOOL_ALL:
        jaddstr(result, "type", "all mempool");
        break;
    case NSPV_MEMPOOL_ADDRESS:
        jaddstr(result, "type", "scan for address received");
        break;
    case NSPV_MEMPOOL_ISSPENT:
        jaddstr(result, "type", "scan for utxo spent");
        break;
    case NSPV_MEMPOOL_INMEMPOOL:
        jaddstr(result, "type", "scan txid in mempool");
        break;
    case NSPV_MEMPOOL_CCEVALCODE:
        jaddstr(result, "type", "scan CC/funcid output");
        jaddnum(result, "evalcode", (int64_t)(ptr->vout & 0xff));
        jaddnum(result, "CCfunc", (int64_t)((ptr->vout >> 8) & 0xff));
        break;
    }
    jaddstr(result, "lastpeer", NSPV_lastpeer);
    return (result);
}

cJSON* NSPV_ntzsresp_json(struct NSPV_ntzsresp* ptr)
{
    cJSON* result = cJSON_CreateObject();
    jaddstr(result, "result", "success");
    jadd(result, "prev", NSPV_ntz_json(&ptr->prevntz));
    jadd(result, "next", NSPV_ntz_json(&ptr->nextntz));
    jaddstr(result, "lastpeer", NSPV_lastpeer);
    return (result);
}

cJSON* NSPV_ntzsproof_json(struct NSPV_ntzsproofresp* ptr)
{
    cJSON* result = cJSON_CreateObject();
    jaddstr(result, "result", "success");
    jaddnum(result, "prevht", ptr->common.prevht);
    jaddnum(result, "nextht", ptr->common.nextht);
    jaddbits256(result, "prevtxid", ptr->prevtxid);
    jaddnum(result, "prevtxidht", ptr->prevtxidht);
    jaddnum(result, "prevtxlen", ptr->prevtxlen);
    jaddbits256(result, "nexttxid", ptr->nexttxid);
    jaddnum(result, "nexttxidht", ptr->nexttxidht);
    jaddnum(result, "nexttxlen", ptr->nexttxlen);
    jaddnum(result, "numhdrs", ptr->common.numhdrs);
    jadd(result, "headers", NSPV_headers_json(ptr->common.hdrs, ptr->common.numhdrs, ptr->common.prevht));
    jaddstr(result, "lastpeer", NSPV_lastpeer);
    return (result);
}

cJSON* NSPV_broadcast_json(struct NSPV_broadcastresp* ptr, bits256 txid)
{
    cJSON* result = cJSON_CreateObject();
    jaddstr(result, "result", "success");
    jaddbits256(result, "expected", txid);
    jaddbits256(result, "broadcast", ptr->txid);
    jaddnum(result, "retcode", ptr->retcode);
    switch (ptr->retcode) {
    case 1:
        jaddstr(result, "type", "broadcast and mempool");
        break;
    case 0:
        jaddstr(result, "type", "broadcast");
        break;
    case -1:
        jaddstr(result, "type", "decode error");
        break;
    case -2:
        jaddstr(result, "type", "timeout");
        break;
    case -3:
        jaddstr(result, "type", "error adding to mempool");
        break;
    default:
        jaddstr(result, "type", "unknown");
        break;
    }
    jaddstr(result, "lastpeer", NSPV_lastpeer);
    return (result);
}
#endif // NSPV_SERDES_H
