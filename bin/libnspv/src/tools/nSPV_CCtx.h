
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

#ifndef NSPV_CCTX_H
#define NSPV_CCTX_H

#include "nSPV_defs.h"
#include "nSPV_CCUtils.h"
// @blackjok3r and @mihailo implement the CC tx creation functions here
// instead of a swissarmy knife finalizeCCtx, i think it is better to pass in the specific info needed into a CC signing function. this would eliminate the comparing to all the different possibilities
// since the CC rpc that creates the tx will know which vins are normal and which ones are CC, and most importantly what type of CC vin it is, it will be much simpler finalize function, though it will mean all the CC rpc calls will have to do more work. that was the rationale behind FinalizeCCtx, but i hear a lot of complaints about the complexity it has become.
// please make a new way of doing CC tx that wont lead to complaints later. let us start with faucetget

cstring* FinalizeCCtx(/*btc_spv_client* client,*/ cJSON* txdata, char* errorout)
{
    int32_t i, n, vini;
    cstring *finalHex, *hex;
    cJSON* sigData = NULL;
    int64_t voutValue;

    if (errorout)
        errorout[0] = '\0';

    if (!cJSON_HasObjectItem(txdata, "hex")) {
        nspv_log_message("%s No field \"hex\" in JSON response from fullnode\n", __func__);
        return NULL;
    }

    hex = cstr_new(jstr(txdata, "hex"));
    cstr_append_c(hex, 0);
    btc_tx* mtx = btc_tx_decodehex(hex->str);

    cstr_free(hex, 1);

    if (!mtx) {
        nspv_log_message("%s Invalid hex tx in JSON response from fullnode (could not parse into mtx)\n", __func__);
        if (errorout) {
            snprintf(errorout, NSPV_MAXERRORLEN - 1, "Invalid hex tx in txdata parameter");
            errorout[NSPV_MAXERRORLEN - 1] = '\0';
        }
        //return(cstr_new("Invalid hex in JSON response from fullnode"));
        return NULL;
    }
    sigData = jarray(&n, txdata, "SigData");

    if (!sigData) {
        nspv_log_message("%s No field \"SigData\" in JSON response from fullnode\n", __func__);
        if (errorout) {
            snprintf(errorout, NSPV_MAXERRORLEN - 1, "No field \"SigData\" in txdata parameter");
            errorout[NSPV_MAXERRORLEN - 1] = '\0';
        }
        btc_tx_free(mtx);
        return NULL;
    }
    for (i = 0; i < n; i++) {

        cJSON* item = jitem(sigData, i);
        vini = jint(item, "vin");
        voutValue = j64bits(item, "amount");
        if (cJSON_HasObjectItem(item, "cc") != 0) {
            CC* cond;
            btc_tx_in* vin = btc_tx_vin(mtx, vini);
            bits256 sigHash;
            char ccerror[256] = {'\0'};

            cond = cc_conditionFromJSON(jobj(item, "cc"), ccerror);
            if (cond == NULL) {
                btc_tx_free(mtx);
                nspv_log_message("%s cc error from cc_conditionFromJSON %s\n", __func__, ccerror);
                if (errorout) {
                    snprintf(errorout, NSPV_MAXERRORLEN - 1, "error from parse \"cc\" field %s", ccerror);
                    errorout[NSPV_MAXERRORLEN - 1] = '\0';
                }
                return NULL;
            }
            cstring* script = CCPubKey(cond);

            uint8_t privkey[32];
            if (cJSON_HasObjectItem(item, "globalPrivKey") != 0) {
                // use global privkey from the komodod
                char* privhex = jstr(item, "globalPrivKey");
                int privhexlen = (int)strlen(privhex);
                int outlen;

                if (privhexlen / 2 > (int)sizeof(privkey))
                    privhexlen = (int)sizeof(privkey) * 2;
                utils_hex_to_bin(privhex, privkey, privhexlen, &outlen);
            } else {
                memcpy(privkey, NSPV_key.privkey, sizeof(privkey));
            }
            sigHash = NSPV_sapling_sighash(mtx, vini, voutValue, (unsigned char*)script->str, script->len);
            sigHash = bits256_rev(sigHash);
            if ((cc_signTreeSecp256k1Msg32(cond, privkey, sigHash.bytes)) != 0) {
                if (vin->script_sig) {
                    cstr_free(vin->script_sig, 1);
                    vin->script_sig = cstr_new("");
                }
                CCSig(cond, vin->script_sig);
            } 

            cstr_free(script, 1);
            cc_free(cond);

            memset(privkey, '\0', sizeof(privkey));
        } else {
            cstring* voutScriptPubkey = cstr_new((char*)utils_hex_to_uint8(jstr(item, "scriptPubKey")));
            if (NSPV_SignTx(mtx, vini, voutValue, voutScriptPubkey, 0) == 0) {
                nspv_log_message("signing error for vini.%d\n", vini);
                if (errorout) {
                    snprintf(errorout, NSPV_MAXERRORLEN - 1, "signing error for vini.%d", vini);
                    errorout[NSPV_MAXERRORLEN - 1] = '\0';
                }
                cstr_free(voutScriptPubkey, 1);
                btc_tx_free(mtx);
                return NULL;
            }
            cstr_free(voutScriptPubkey, 1);
        }
    }
    finalHex = btc_tx_to_cstr(mtx);
    //nspv_log_message("%s returning signed hex tx\n", __func__);

    btc_tx_free(mtx);
    return (finalHex);
}
#endif // NSPV_CCTX_H
