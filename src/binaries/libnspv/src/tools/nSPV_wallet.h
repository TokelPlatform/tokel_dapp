
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

#ifndef KOMODO_NSPVWALLET_H
#define KOMODO_NSPVWALLET_H

#include <sodium/crypto_generichash_blake2b.h>
const unsigned char ZCASH_PREVOUTS_HASH_PERSONALIZATION[16] =
{ 'Z','c','a','s','h','P','r','e','v','o','u','t','H','a','s','h' };
const unsigned char ZCASH_SEQUENCE_HASH_PERSONALIZATION[16] =
{ 'Z','c','a','s','h','S','e','q','u','e','n','c','H','a','s','h' };
const unsigned char ZCASH_OUTPUTS_HASH_PERSONALIZATION[16] =
{ 'Z','c','a','s','h','O','u','t','p','u','t','s','H','a','s','h' };
const unsigned char ZCASH_JOINSPLITS_HASH_PERSONALIZATION[16] =
{ 'Z','c','a','s','h','J','S','p','l','i','t','s','H','a','s','h' };
const unsigned char ZCASH_SHIELDED_SPENDS_HASH_PERSONALIZATION[16] =
{ 'Z','c','a','s','h','S','S','p','e','n','d','s','H','a','s','h' };
const unsigned char ZCASH_SHIELDED_OUTPUTS_HASH_PERSONALIZATION[16] =
{ 'Z','c','a','s','h','S','O','u','t','p','u','t','H','a','s','h' };
const unsigned char ZCASH_SIG_HASH_SAPLING_PERSONALIZATION[16] =
{ 'Z','c','a','s','h','S','i','g','H','a','s','h', '\xBB', '\x09', '\xB8', '\x76' };
const unsigned char ZCASH_SIG_HASH_OVERWINTER_PERSONALIZATION[16] =
{ 'Z','c','a','s','h','S','i','g','H','a','s','h', '\x19', '\x1B', '\xA8', '\x5B' };

#include <btc/block_kmd.h>
#include <btc/merkle_c.h>
int GetProofMerkleRoot(uint8_t *proof, int prooflen, merkle_block *pMblock, vector *vmatch, uint256 mroot);

bits256 NSPV_sapling_sighash(btc_tx *tx,int32_t vini,int64_t spendamount,uint8_t *spendscript,int32_t spendlen)
{
    // sapling tx sighash preimage
    uint8_t *for_sig_hash;
    
    bits256 sigtxid; int32_t hashtype,version,i; uint32_t len = 0; btc_tx_in *vin; btc_tx_out *vout;

    // alloc size until spendscript:
    for_sig_hash = malloc(sizeof(int32_t) + sizeof(int32_t) +
        32 + 32 + 32 + 32 + 32 + 32 +
        sizeof(uint32_t) + sizeof(uint32_t) + sizeof(uint64_t) + sizeof(int32_t) + sizeof(uint256) + sizeof(int32_t) +
        sizeof(spendlen) + spendlen + sizeof(int64_t) + sizeof(uint32_t));

    hashtype = SIGHASH_ALL;
    version = (tx->version & 0x7fffffff);
    len = iguana_rwnum(1, &for_sig_hash[len], sizeof(tx->version), &tx->version);
    len += iguana_rwnum(1, &for_sig_hash[len], sizeof(tx->nVersionGroupId), &tx->nVersionGroupId);
    {
        uint8_t *prev_outs = NULL, hash_prev_outs[32]; int32_t prev_outs_len = 0;
        for (i=0; i<(int32_t)tx->vin->len; i++)
        {
            vin = btc_tx_vin(tx,i);
            prev_outs = realloc(prev_outs, prev_outs_len + sizeof(vin->prevout.hash) + sizeof(vin->prevout.n));
            prev_outs_len += iguana_rwbignum2(1,&prev_outs[prev_outs_len],sizeof(vin->prevout.hash), (uint8_t *)vin->prevout.hash);
            prev_outs_len += iguana_rwnum(1, &prev_outs[prev_outs_len], sizeof(vin->prevout.n), &vin->prevout.n);
        }

        // char prev_outs_hex[sizeof(prev_outs) * 2 + 1];
        // utils_bin_to_hex(prev_outs, prev_outs_len, prev_outs_hex);
        // debug hash: nspv_log_message("%s prev_outs_hex=%s\n", __func__, prev_outs_hex);

        crypto_generichash_blake2b_salt_personal(hash_prev_outs,32,prev_outs,(uint64_t)prev_outs_len,
                                                 NULL,0,NULL,ZCASH_PREVOUTS_HASH_PERSONALIZATION);

        memcpy(&for_sig_hash[len], hash_prev_outs, 32);
        len += 32;
        free(prev_outs);
    }
    {
        uint8_t *sequence = NULL, sequence_hash[32];
        int32_t sequence_len = 0;
        for (i=0; i<(int32_t)tx->vin->len; i++)
        {
            vin = btc_tx_vin(tx,i);
            sequence = realloc(sequence, sequence_len+sizeof(vin->sequence));
            sequence_len += iguana_rwnum(1, &sequence[sequence_len], sizeof(vin->sequence),&vin->sequence);
        }
        crypto_generichash_blake2b_salt_personal(sequence_hash,32,sequence,(uint64_t)sequence_len,
                                                 NULL,0,NULL,ZCASH_SEQUENCE_HASH_PERSONALIZATION);
        
        memcpy(&for_sig_hash[len],sequence_hash,32);
        free(sequence);
        len += 32;
    }
    // removed limit: "assumes script_pubkey < 256 bytes"
    {
        uint8_t *outputs = NULL, hash_outputs[32]; uint32_t outputs_len = 0;
        outputs_len = 0;
        for (i=0; i<(int32_t)tx->vout->len; i++)
        {
            vout = btc_tx_vout(tx,i);
            outputs = realloc(outputs, outputs_len + sizeof(vout->value));
            outputs_len += iguana_rwnum(1, &outputs[outputs_len], sizeof(vout->value), &vout->value);

            write_compact_size_and_msg(&outputs, &outputs_len, (uint8_t*)vout->script_pubkey->str, vout->script_pubkey->len);
        }

        crypto_generichash_blake2b_salt_personal(hash_outputs,32,outputs,(uint64_t)outputs_len,
                                                 NULL,0,NULL,ZCASH_OUTPUTS_HASH_PERSONALIZATION);
        
        memcpy(&for_sig_hash[len],hash_outputs,32);
        len += 32;
        free(outputs);
    }
    // no join splits, fill the hashJoinSplits with 32 zeros
    memset(&for_sig_hash[len], 0, 32);
    len += 32;
    if ( version > 3 )
    {
        // no shielded spends, fill the hashShieldedSpends with 32 zeros
        memset(&for_sig_hash[len], 0, 32);
        len += 32;
        // no shielded outputs, fill the hashShieldedOutputs with 32 zeros
        memset(&for_sig_hash[len], 0, 32);
        len += 32;
    }
    len += iguana_rwnum(1, &for_sig_hash[len], sizeof(tx->locktime), &tx->locktime);
    len += iguana_rwnum(1, &for_sig_hash[len], sizeof(tx->nExpiryHeight), &tx->nExpiryHeight);
    if (version > 3)
        len += iguana_rwnum(1, &for_sig_hash[len], sizeof(tx->valueBalance), &tx->valueBalance);
    len += iguana_rwnum(1, &for_sig_hash[len], sizeof(hashtype), &hashtype);
    vin = btc_tx_vin(tx,vini);
    len += iguana_rwbignum2(1, &for_sig_hash[len], sizeof(vin->prevout.hash), vin->prevout.hash);
    len += iguana_rwnum(1, &for_sig_hash[len], sizeof(vin->prevout.n), &vin->prevout.n);
    
    write_compact_size_and_msg(&for_sig_hash, &len, spendscript, spendlen);

    for_sig_hash = realloc(for_sig_hash, len + sizeof(spendamount) + sizeof(vin->sequence));
    len += iguana_rwnum(1, &for_sig_hash[len], sizeof(spendamount), &spendamount);
    len += iguana_rwnum(1, &for_sig_hash[len], sizeof(vin->sequence), &vin->sequence);
    unsigned const char *sig_hash_personal = ZCASH_SIG_HASH_OVERWINTER_PERSONALIZATION;
    if (version == 4)
        sig_hash_personal = ZCASH_SIG_HASH_SAPLING_PERSONALIZATION;

    // char for_sig_hash_hex[sizeof(for_sig_hash) * 2 + 1];
    // utils_bin_to_hex(for_sig_hash, len, for_sig_hash_hex);
    // debug hash: nspv_log_message("%s for_sig_hash_hex=%s\n", __func__, for_sig_hash_hex);

    crypto_generichash_blake2b_salt_personal(sigtxid.bytes,32,for_sig_hash,(uint64_t)len,
                                             NULL,0,NULL,sig_hash_personal);
    free(for_sig_hash);
    return(bits256_rev(sigtxid));
}

int32_t NSPV_validatehdrs(btc_spv_client *client,struct NSPV_ntzsproofresp *ptr, struct NSPV_ntzsresp *notarizations)
{
    int32_t i,height,txidht; btc_tx *tx; bits256 blockhash,txid,desttxid;
    if ( (ptr->common.nextht-ptr->common.prevht+1) != ptr->common.numhdrs )
    {
        nspv_log_message("next.%d prev.%d -> %d vs %d\n",ptr->common.nextht, ptr->common.prevht, ptr->common.nextht-ptr->common.prevht+1, ptr->common.numhdrs);
        return(-2);
    }
    else if ( ptr->nexttxlen == 0 || (tx= NSPV_txextract(ptr->nextntz,ptr->nexttxlen)) == 0 )
        return(-3);
    else if ( bits256_cmp(NSPV_tx_hash(tx),ptr->nexttxid) != 0 )
    {
        btc_tx_free(tx);
        return(-4);
    }
    else if ( NSPV_notarizationextract(client,1,&height,&blockhash,&desttxid,tx,notarizations->nextntz.timestamp) < 0 )
    {
        btc_tx_free(tx);
        return(-5);
    }
    else if ( height != ptr->common.nextht )
    {
        nspv_log_message("height.%d %x != common %d %x\n",height,height,ptr->common.nextht,ptr->common.nextht);
        btc_tx_free(tx);
        return(-6);
    }
    else if ( bits256_cmp(NSPV_hdrhash(&ptr->common.hdrs[ptr->common.numhdrs-1]),blockhash) != 0 )
    {
        btc_tx_free(tx);
        return(-7);
    }
    btc_tx_free(tx);
    for (i=ptr->common.numhdrs-1; i>0; i--)
    {
        blockhash = NSPV_hdrhash(&ptr->common.hdrs[i-1]);
        if ( bits256_cmp(blockhash,ptr->common.hdrs[i].hashPrevBlock) != 0 )
            return(-i-13);
    }
    sleep(1); // need this to get past the once per second rate limiter per message
    if (  ptr->prevtxlen == 0 || (tx= NSPV_txextract(ptr->prevntz,ptr->prevtxlen)) == 0 )
        return(-8);
    else if ( bits256_cmp(NSPV_tx_hash(tx),ptr->prevtxid) )
    {
        btc_tx_free(tx);
        return(-9);
    }
    else if ( NSPV_notarizationextract(client,1,&height,&blockhash,&desttxid,tx,notarizations->prevntz.timestamp) < 0 )
    {
        btc_tx_free(tx);
        return(-10);
    }
    else if ( height != ptr->common.prevht )
    {
        btc_tx_free(tx);
        return(-11);
    }
    else if ( bits256_cmp(NSPV_hdrhash(&ptr->common.hdrs[0]),blockhash) != 0 )
    {
        btc_tx_free(tx);
        return(-12);
    }
    btc_tx_free(tx);
    return(0);
}

btc_tx *NSPV_gettransaction(btc_spv_client *client,int32_t *retvalp,int32_t isKMD,int32_t skipvalidation,int32_t v,bits256 txid,int32_t height,int64_t extradata,uint32_t tiptime,int64_t *rewardsump)
{
    struct NSPV_txproof *ptr; btc_tx_out *vout; btc_tx *tx = 0; char str[65],str2[65]; int32_t offset; int64_t rewards = 0; uint32_t nLockTime; cstring *proof = 0; bits256 proofroot = zeroid;
    *retvalp = skipvalidation != 0 ? 0 : -1;
    if ( (ptr= NSPV_txproof_find(txid,height)) == 0 )
    {
        NSPV_txproof(1,client,v,txid,height);
        ptr = &NSPV_txproofresult;
    }
    if ( bits256_cmp(ptr->txid,txid) != 0 )
    {
        nspv_log_message("txproof error %s != %s\n",bits256_str(str,ptr->txid),bits256_str(str2,txid));
        return(0);
    }
    else if ( ptr->txlen == 0 || (tx= NSPV_txextract(ptr->tx,ptr->txlen)) == 0 )
        return(0);
    else if ( bits256_cmp(NSPV_tx_hash(tx),txid) != 0 )
    {
        *retvalp = -2001;
        return(tx);
    }
    else if ( skipvalidation == 0 && ptr->unspentvalue <= 0 )
    {
        *retvalp = -2002;
        return(tx);
    }
    else if ( isKMD != 0 && tiptime != 0 )
    {
        if ( (vout= btc_tx_vout(tx,v)) != 0 )
        {
            rewards = komodo_interestnew(height!=0?height:1000000,vout->value,tx->locktime,tiptime);
            (*rewardsump) += rewards;
        }
        if ( rewards != extradata )
            nspv_log_message("extradata %.8f vs rewards %.8f\n",dstr(extradata),dstr(rewards));
    }
    if ( skipvalidation == 0 )
    {
        if ( ptr->txprooflen > 0 )
        {
            proof = cstr_new_sz(ptr->txprooflen);
            memcpy(proof->str,ptr->txproof,ptr->txprooflen);
            proof->len = ptr->txprooflen;
        }
        if ( proof == NULL )
        {
            nspv_log_message("proof is missing, try a higher block height\n");
            *retvalp = -2006;
            return(tx);
        }
        NSPV_notarizations(client,height); // gets the prev and next notarizations
        if ( NSPV_inforesult.notarization.height >= height && (NSPV_ntzsresult.prevntz.height == 0 || NSPV_ntzsresult.prevntz.height >= NSPV_ntzsresult.nextntz.height) )
        {
            nspv_log_message("issue manual bracket\n");
            NSPV_notarizations(client,height-1);
            NSPV_notarizations(client,height+1);
            NSPV_notarizations(client,height); // gets the prev and next notarizations
        }
        if ( NSPV_ntzsresult.prevntz.height != 0 && NSPV_ntzsresult.prevntz.height <= NSPV_ntzsresult.nextntz.height )
        {
            nspv_log_message(">>>>> gettx ht.%d prev.%d next.%d\n",height,NSPV_ntzsresult.prevntz.height, NSPV_ntzsresult.nextntz.height);
            offset = (height - NSPV_ntzsresult.prevntz.height);
            if ( offset >= 0 && height <= NSPV_ntzsresult.nextntz.height )
            {
                //nspv_log_message("call NSPV_txidhdrsproof %s %s\n",bits256_str(str,NSPV_ntzsresult.prevntz.txid),bits256_str(str2,NSPV_ntzsresult.nextntz.txid));
                NSPV_txidhdrsproof(client,NSPV_ntzsresult.prevntz.txid,NSPV_ntzsresult.nextntz.txid);
                usleep(10000);
                //nspv_log_message("call validate prooflen.%d\n",(int32_t)proof->len);
                if ( (*retvalp= NSPV_validatehdrs(client,&NSPV_ntzsproofresult, &NSPV_ntzsresult)) == 0 )
                {
                    uint256 mroot,revtxid; merkle_block MB; vector *vmatch;
                    init_mblock(&MB);
                    vmatch = vector_new(sizeof(bits256),free);
                    GetProofMerkleRoot((uint8_t *)proof->str,(int32_t)proof->len,&MB,vmatch,mroot);
                    proofroot = btc_uint256_to_bits256(mroot);
                    memset(mroot,0,sizeof(mroot));
                    btc_bits256_to_uint256(txid,revtxid);
                    if ( bits256_cmp(proofroot,NSPV_ntzsproofresult.common.hdrs[offset].hashMerkleRoot) != 0 || memcmp(revtxid,vmatch->data[0],32) != 0 )
                    {
                        int32_t i;
                        for (i=0; i<32; i++)
                            nspv_log_message("%02x",revtxid[i]);
                        nspv_log_message(" vs. ");
                        for (i=0; i<32; i++)
                            nspv_log_message("%02x",((uint8_t *)vmatch->data[0])[i]);

                        nspv_log_message(" prooflen.%d proofroot.%s vs %s\n",(int32_t)proof->len,bits256_str(str,proofroot),bits256_str(str2,NSPV_ntzsproofresult.common.hdrs[offset].hashMerkleRoot));
                        *retvalp = -2003;
                    }
                    else
                    {
                        *retvalp = 0;
                        nspv_log_message("%s merkleproof validated!\n",bits256_str(str,txid));
                    }
                    free_mblock_data(&MB);
                    vector_free(vmatch,1);
                }
            } else *retvalp = -2005;
        } else *retvalp = -2004;
    }
    return(tx);
}

int32_t NSPV_vinselect(int32_t *aboveip,int64_t *abovep,int32_t *belowip,int64_t *belowp,struct NSPV_utxoresp utxos[],int32_t numunspents,int64_t value)
{
    int32_t i,abovei,belowi; int64_t above,below,gap,atx_value;
    abovei = belowi = -1;
    for (above=below=i=0; i<numunspents; i++)
    {
        if ( (atx_value= utxos[i].satoshis) <= 0 )
            continue;
        if ( atx_value == value )
        {
            *aboveip = *belowip = i;
            *abovep = *belowp = 0;
            return(i);
        }
        else if ( atx_value > value )
        {
            gap = (atx_value - value);
            if ( above == 0 || gap < above )
            {
                above = gap;
                abovei = i;
            }
        }
        else
        {
            gap = (value - atx_value);
            if ( below == 0 || gap < below )
            {
                below = gap;
                belowi = i;
            }
        }
        //printf("value %.8f gap %.8f abovei.%d %.8f belowi.%d %.8f\n",dstr(value),dstr(gap),abovei,dstr(above),belowi,dstr(below));
    }
    *aboveip = abovei;
    *abovep = above;
    *belowip = belowi;
    *belowp = below;
    //printf("above.%d below.%d\n",abovei,belowi);
    if ( abovei >= 0 && belowi >= 0 )
    {
        if ( above < (below >> 1) )
            return(abovei);
        else return(belowi);
    }
    else if ( abovei >= 0 )
        return(abovei);
    else return(belowi);
}

int64_t NSPV_addinputs(struct NSPV_utxoresp *used,btc_tx *mtx,int64_t total,int32_t maxinputs,struct NSPV_utxoresp *ptr,int32_t num)
{
    int32_t abovei,belowi,ind,vout,i,n = 0; int64_t threshold,above,below; int64_t remains,totalinputs = 0; struct NSPV_utxoresp utxos[NSPV_MAXVINS],*up;
    memset(utxos,0,sizeof(utxos));
    if ( maxinputs > NSPV_MAXVINS )
        maxinputs = NSPV_MAXVINS;
    if ( maxinputs > 0 )
        threshold = total/maxinputs;
    else threshold = total;
    for (i=0; i<num; i++)
    {
        if ( ptr[i].satoshis > threshold )
            utxos[n++] = ptr[i];
        if ( n >= maxinputs )
            break;
    }
    remains = total;
//nspv_log_message("threshold %.8f n.%d num.%d for total %.8f, maxvins.%d NSPV_MAXVINS.%d\n",(double)threshold/COIN,num,n,(double)total/COIN,maxinputs,NSPV_MAXVINS);
    for (i=0; i<maxinputs && n>0; i++)
    {
        below = above = 0;
        abovei = belowi = -1;
        if ( NSPV_vinselect(&abovei,&above,&belowi,&below,utxos,n,remains) < 0 )
        {
            nspv_log_message("error finding unspent i.%d of %d, %.8f vs %.8f\n",i,n,(double)remains/COIN,(double)total/COIN);
            return(0);
        }
        if ( belowi < 0 || abovei >= 0 )
            ind = abovei;
        else ind = belowi;
        if ( ind < 0 )
        {
            nspv_log_message("error finding unspent i.%d of %d, %.8f vs %.8f, abovei.%d belowi.%d ind.%d\n",i,n,(double)remains/COIN,(double)total/COIN,abovei,belowi,ind);
            return(0);
        }
//nspv_log_message("i.%d ind.%d abovei.%d belowi.%d n.%d\n",i,ind,abovei,belowi,n);
        up = &utxos[ind];
        btc_tx_add_txin(mtx,up->txid,up->vout);
        used[i] = *up;
        totalinputs += up->satoshis;
        remains -= up->satoshis;
        utxos[ind] = utxos[--n];
        memset(&utxos[n],0,sizeof(utxos[n]));
//nspv_log_message("totalinputs %.8f vs total %.8f i.%d vs max.%d\n",(double)totalinputs/COIN,(double)total/COIN,i,maxinputs);
        if ( totalinputs >= total || (i+1) >= maxinputs )
            break;
    }
    //nspv_log_message("totalinputs %.8f vs total %.8f\n",(double)totalinputs/COIN,(double)total/COIN);
    if ( totalinputs >= total )
        return(totalinputs);
    return(0);
}

bool NSPV_SignTx(btc_tx *mtx,int32_t vini,int64_t utxovalue,cstring *scriptPubKey,uint32_t nTime)
{
    uint32_t branchid; bits256 sighash; char str[65]; int32_t i,extralen,sigerr=0; uint256 hash; uint8_t sig[128]; size_t siglen=0; btc_tx_in *vin=0;
    if ( nTime != 0 && mtx->version == 1 )
    {
        fprintf(stderr,"use legacy sig validation\n");
        branchid = 0;
    } else branchid = SAPLING_VERSION_GROUP_ID;
    if ( branchid != 0 )
    {
        sighash = NSPV_sapling_sighash(mtx,vini,utxovalue,(uint8_t *)scriptPubKey->str,scriptPubKey->len);
        btc_bits256_to_uint256(sighash,hash);
        char hex[sizeof(uint256) * 2 + 1];
        utils_bin_to_hex(hash, sizeof(uint256), hex);
        nspv_log_message("%s NSPV_sapling_sighash=%s\n", __func__, hex);
    }
    else
    {
        memset(hash,0,sizeof(hash));
        btc_tx_sighash(mtx,scriptPubKey,vini,SIGHASH_ALL,utxovalue,SIGVERSION_BASE,hash);
        char hex[sizeof(uint256) * 2 + 1];
        utils_bin_to_hex(hash, sizeof(uint256), hex);
        nspv_log_message("%s btc_tx_sighash=%s\n", __func__, hex);
    }
    siglen = sizeof(sig);
    char privhex[64+1];
    utils_bin_to_hex(NSPV_key.privkey, 32, privhex);
    nspv_log_message("%s priv=%s utxovalue=%lld\n", __func__, privhex, utxovalue);

    if ( btc_key_sign_hash(&NSPV_key,hash,sig,&siglen) == 0 )
        sigerr = -1;
    else
    {
        // for (i=0; i<(int32_t)siglen; i++)
        //     fprintf(stderr,"%02x",sig[i]);
        vin = btc_tx_vin(mtx,vini);
        if ( scriptPubKey->len == 25 )
            extralen = 34;
        else extralen = 0;
        if (vin->script_sig) cstr_free(vin->script_sig,1);
        vin->script_sig = cstr_new_sz(siglen+2+extralen);
        vin->script_sig->str[0] = siglen+1;
        memcpy(vin->script_sig->str+1,sig,siglen);
        vin->script_sig->str[siglen+1] = 1;
        if ( extralen != 0 )
        {
            vin->script_sig->str[2 + siglen] = 33;
            memcpy(vin->script_sig->str+2+siglen+1,NSPV_pubkey.pubkey,extralen-1);
        }
        vin->script_sig->len = siglen+2+extralen;
        //nspv_log_message(" sighash %s, sigerr.%d siglen.%d\n",bits256_str(str,sighash),sigerr,vin!=0?(int32_t)vin->script_sig->len:(int32_t)siglen);
    }
    return(true);
}

cstring *NSPV_signtx(btc_spv_client *client,int32_t isKMD,int64_t *rewardsump,int64_t *interestsump,cJSON *retcodes,btc_tx *mtx,int64_t txfee,struct NSPV_utxoresp used[])
{
    btc_tx *vintx=0; btc_tx_in *vin; btc_tx_out *vout; cstring *hex = 0; char str[65]; bits256 prevhash; int64_t interest=0,change=0,totaloutputs=0,totalinputs=0; int32_t i,utxovout,n=0,validation;
    *rewardsump = *interestsump = 0;
    if ( mtx == 0 )
    {
        nspv_log_message("cant sign null mtx\n");
        return(0);
    }
    if ( mtx->vout != 0 )
    {
        n = mtx->vout->len;
        for (i=0; i<n; i++)
        {
            if ( (vout= btc_tx_vout(mtx,i)) != 0 )
                totaloutputs += vout->value;
        }
    }
    if ( mtx->vin != 0 )
    {
        n = mtx->vin->len;
        for (i=0; i<n; i++)
        {
            totalinputs += used[i].satoshis;
            interest += used[i].extradata;
        }
    }
    *interestsump = interest;
    if ( (totalinputs+interest) >= totaloutputs+2*txfee )
    {
        change = (totalinputs+interest) - (totaloutputs+txfee);
        btc_tx_add_p2pk(mtx,change,NSPV_pubkey.pubkey);
    }
    if ( mtx->vin != 0 )
        n = mtx->vin->len;
    else n = 0;
    for (i=0; i<n; i++)
    {
        if ( (vin= btc_tx_vin(mtx,i)) == 0 )
        {
            nspv_log_message("mtx has no vin.%d\n",i);
            return(0);
        }
        utxovout = vin->prevout.n;
        prevhash = btc_uint256_to_bits256(vin->prevout.hash);
        if ( i > 0 )
            sleep(1);
        vintx = NSPV_gettransaction(client,&validation,isKMD,0,utxovout,prevhash,used[i].height,used[i].extradata,NSPV_tiptime,rewardsump);
        jaddinum(retcodes,validation);
        if ( vintx != 0 && validation != -1 && (vout= btc_tx_vout(vintx,utxovout)) != 0 ) // other validation retcodes are degraded security
        {
            if ( vout->value != used[i].satoshis )
            {
                nspv_log_message("vintx mismatch %.8f != %.8f\n",(double)vout->value/COIN,(double)used[i].satoshis/COIN);
                return(0);
            }
            else if ( utxovout != used[i].vout )
            {
                nspv_log_message("vintx vout mismatch %d != %d\n",utxovout,used[i].vout);
                return(0);
            }
            else if ( NSPV_SignTx(mtx,i,vout->value,vout->script_pubkey,0) == 0 )
            {
                nspv_log_message("signing error for vini.%d\n",i);
                return(0);
            } // else nspv_log_message("signed vini.%d\n",i);
        } 
        else 
            nspv_log_message("couldnt find txid.%s/v%d or it was spent retcode.%d\n",bits256_str(str,prevhash),utxovout,validation); // of course much better handling is needed
        if ( vintx != 0 )
        {
            btc_tx_free(vintx);
            vintx = 0;
        }
    }
    nspv_log_message("sign %d inputs %.8f + interest %.8f -> %d outputs %.8f change %.8f\n",(int32_t)mtx->vin->len,(double)totalinputs/COIN,(double)interest/COIN,(int32_t)mtx->vout->len,(double)totaloutputs/COIN,(double)change/COIN);
    return(btc_tx_to_cstr(mtx));
}

cJSON *NSPV_spend(btc_spv_client *client,char *srcaddr,char *destaddr,int64_t satoshis)
{
    cJSON *result = cJSON_CreateObject(),*retcodes = cJSON_CreateArray(); uint8_t *ptr,rmd160[128]; int32_t len,isKMD = 0; int64_t totalinputs,change,txfee = 10000; cstring *scriptPubKey=0,*hex=0; btc_tx *mtx=0,*tx=0; struct NSPV_utxoresp used[NSPV_MAXVINS+16]; char numstr[64]; int64_t rewardsum=0,interestsum=0;
    if ( NSPV_logintime == 0 || time(NULL) > NSPV_logintime+NSPV_AUTOLOGOUT )
    {
        jaddstr(result,"result","error");
        jaddstr(result,"error","wif expired");
        return(result);
    }
    if ( strcmp(srcaddr,NSPV_address) != 0 )
    {
        jaddstr(result,"result","error");
        jaddstr(result,"error","invalid address");
        jaddstr(result,"mismatched",srcaddr);
        return(result);
    }
    if ( NSPV_inforesult.height == 0 )
    {
        jaddstr(result,"result","error");
        jaddstr(result,"error","couldnt getinfo");
        return(result);
    }
    if ( NSPV_utxosresult.CCflag != 0 || strcmp(NSPV_utxosresult.coinaddr,srcaddr) != 0 || NSPV_utxosresult.nodeheight < NSPV_inforesult.height )
        NSPV_addressutxos(1,client,srcaddr,0,0,0);
    if ( NSPV_utxosresult.CCflag != 0 || strcmp(NSPV_utxosresult.coinaddr,srcaddr) != 0 || NSPV_utxosresult.nodeheight < NSPV_inforesult.height )
    {
        jaddstr(result,"result","error");
        jaddstr(result,"address",NSPV_utxosresult.coinaddr);
        jaddstr(result,"srcaddr",srcaddr);
        jaddnum(result,"nodeheight",NSPV_utxosresult.nodeheight);
        jaddnum(result,"infoheight",NSPV_inforesult.height);
        jaddnum(result,"CCflag",NSPV_utxosresult.CCflag);
        jaddstr(result,"error","couldnt get addressutxos");
        return(result);
    }
    if ( NSPV_utxosresult.total < satoshis+txfee )
    {
        jaddstr(result,"result","error");
        jaddstr(result,"error","not enough funds");
        jaddnum(result,"balance",(double)NSPV_utxosresult.total/COIN);
        jaddnum(result,"amount",(double)satoshis/COIN);
        return(result);
    }
    if ( btc_base58_decode_check(destaddr,rmd160,sizeof(rmd160)) != 25 )
    {
        if ( (len= is_hexstr(destaddr,0)) > 0 ) // all hex string
        {
            len >>= 1;
            scriptPubKey = cstr_new_sz(len);
            decode_hex((uint8_t *)scriptPubKey->str,len,destaddr);
            scriptPubKey->len = len;
        }
        else
        {
            jaddstr(result,"result","error");
            jaddstr(result,"error","invalid destaddr");
            jaddstr(result,"destaddr",destaddr);
            return(result);
        }
    }
    else
    {
        scriptPubKey = cstr_new_sz(25);
        btc_script_build_p2pkh(scriptPubKey,rmd160+1);
    }
    nspv_log_message("%s numutxos.%d balance %.8f\n",NSPV_utxosresult.coinaddr,NSPV_utxosresult.numutxos,(double)NSPV_utxosresult.total/COIN);
    mtx = btc_tx_new(client->chainparams->komodo != 0 ? SAPLING_TX_VERSION : 1);
    isKMD = (strcmp(client->chainparams->name,"KMD") == 0);
    if ( isKMD != 0 )
        mtx->locktime = (uint32_t)time(NULL) - 777;
    memset(used,0,sizeof(used));
    if ( (totalinputs= NSPV_addinputs(used,mtx,satoshis+txfee,NSPV_MAXVINS,NSPV_utxosresult.utxos,NSPV_utxosresult.numutxos)) > 0 )
    {
        change = totalinputs - (satoshis + txfee);
        btc_tx_add_txout(mtx,satoshis,scriptPubKey);
        if ( NSPV_logintime == 0 || time(NULL) > NSPV_logintime+NSPV_AUTOLOGOUT )
        {
            jaddstr(result,"result","error");
            jaddstr(result,"error","wif expired");
            btc_tx_free(mtx);
            return(result);
        }
        hex = NSPV_signtx(client,isKMD,&rewardsum,&interestsum,retcodes,mtx,txfee,used);
        if ( isKMD != 0 )
        {
            sprintf(numstr,"%.8f",(double)interestsum/COIN);
            jaddstr(result,"rewards",numstr);
            sprintf(numstr,"%.8f",(double)rewardsum/COIN);
            jaddstr(result,"validated",numstr);
        }
        if ( hex != 0 && hex->len > 0 )
        {
            if ( (tx= btc_tx_decodehex(hex->str)) != 0 )
            {
                sprintf(numstr,"%.8f",(double)txfee/COIN);
                jaddstr(result,"txfee",numstr);
                sprintf(numstr,"%.8f",(double)totalinputs/COIN);
                jaddstr(result,"total",numstr);
                sprintf(numstr,"%.8f",(double)change/COIN);
                jaddstr(result,"change",numstr);
                jaddbits256(result,"txid",NSPV_tx_hash(tx));
                jadd(result,"tx",btc_tx_to_json(tx));
                jaddstr(result,"result","success");
                jaddstr(result,"hex",hex->str);
                jadd(result,"retcodes",retcodes);
            }
            else
            {
                jaddstr(result,"result","error");
                jaddstr(result,"error","couldnt decode");
                jaddstr(result,"hex",hex->str);
            }
        }
        else
        {
            jaddstr(result,"result","error");
            jadd(result,"retcodes",retcodes);
            jaddstr(result,"error","signing error");
        }
        btc_tx_free(mtx);
        if ( tx != 0 )
            btc_tx_free(tx);
        cstr_free(hex,1);
        jaddstr(result,"lastpeer",NSPV_lastpeer);
        return(result);
    }
    else
    {
        jaddstr(result,"result","error");
        jaddstr(result,"error","couldnt create tx");
        btc_tx_free(mtx);
        cstr_free(scriptPubKey,1);
        jaddstr(result,"lastpeer",NSPV_lastpeer);
        return(result);
    }
    return(0);
}

#ifdef SUPPORT_CC
int64_t NSPV_AddNormalinputs(CMutableTransaction &mtx,CPubKey mypk,int64_t total,int32_t maxinputs,struct NSPV_CCmtxinfo *ptr)
{
    char coinaddr[64]; int32_t CCflag = 0;
    if ( ptr != 0 )
    {
        mtx.fOverwintered = true;
        mtx.nExpiryHeight = 0;
        mtx.nVersionGroupId = SAPLING_VERSION_GROUP_ID;
        mtx.nVersion = SAPLING_TX_VERSION;
        Getscriptaddress(coinaddr,CScript() << ParseHex(HexStr(mypk)) << OP_CHECKSIG);
        if ( strcmp(ptr->U.coinaddr,coinaddr) != 0 )
        {
            NSPV_addressutxos(1,coinaddr,CCflag,0,0);
            NSPV_utxosresp_purge(&ptr->U);
            NSPV_utxosresp_copy(&ptr->U,&NSPV_utxosresult);
        }
        fprintf(stderr,"%s numutxos.%d\n",ptr->U.coinaddr,ptr->U.numutxos);
        memset(ptr->used,0,sizeof(ptr->used));
        return(NSPV_addinputs(ptr->used,mtx,total,maxinputs,ptr->U.utxos,ptr->U.numutxos));
    } else return(0);
}

void NSPV_utxos2CCunspents(struct NSPV_utxosresp *ptr,std::vector<std::pair<CAddressUnspentKey, CAddressUnspentValue> > &outputs)
{
    CAddressUnspentKey key; CAddressUnspentValue value; int32_t i,type; uint160 hashBytes; std::string addrstr(ptr->coinaddr);
    if ( ptr->utxos != NULL && ptr->numutxos > 0 )
    {
        CBitcoinAddress address(addrstr);
        if ( address.GetIndexKey(hashBytes, type, ptr->CCflag) == 0 )
        {
            fprintf(stderr,"couldnt get indexkey\n");
            return;
        }
        for (i = 0; i < ptr->numutxos; i ++)
        {
            key.type = type;
            key.hashBytes = hashBytes;
            key.txhash = ptr->utxos[i].txid;
            key.index = ptr->utxos[i].vout;
            value.satoshis = ptr->utxos[i].satoshis;
            value.blockHeight = ptr->utxos[i].height;
            outputs.push_back(std::make_pair(key, value));
        }
    }
}

void NSPV_txids2CCtxids(struct NSPV_txidsresp *ptr,std::vector<std::pair<CAddressIndexKey, CAmount> > &txids)
{
    CAddressIndexKey key; int64_t value; int32_t i,type; uint160 hashBytes; std::string addrstr(ptr->coinaddr);
    if ( ptr->txids != NULL && ptr->numtxids > 0 )
    {
        CBitcoinAddress address(addrstr);
        if ( address.GetIndexKey(hashBytes, type, ptr->CCflag) == 0 )
        {
            fprintf(stderr,"couldnt get indexkey\n");
            return;
        }
        for (i = 0; i < ptr->numtxids; i ++)
        {
            key.type = type;
            key.hashBytes = hashBytes;
            key.txhash = ptr->txids[i].txid;
            key.index = ptr->txids[i].vout;
            key.blockHeight = ptr->txids[i].height;
            value = ptr->txids[i].satoshis;
            txids.push_back(std::make_pair(key, value));
        }
    }
}

void NSPV_CCunspents(std::vector<std::pair<CAddressUnspentKey, CAddressUnspentValue> > &outputs,char *coinaddr,bool ccflag)
{
    NSPV_addressutxos(1,coinaddr,ccflag,0,0);
    NSPV_utxos2CCunspents(&NSPV_utxosresult,outputs);
}

void NSPV_CCtxids(std::vector<std::pair<CAddressIndexKey, CAmount> > &txids,char *coinaddr,bool ccflag)
{
    NSPV_addresstxids(1,coinaddr,ccflag,0,0);
    NSPV_txids2CCtxids(&NSPV_txidsresult,txids);
}
#endif

#endif // KOMODO_NSPVWALLET_H
