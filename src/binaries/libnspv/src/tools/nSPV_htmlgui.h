
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

#ifndef KOMODO_NSPVHTMLGUI_H
#define KOMODO_NSPVHTMLGUI_H


int32_t NSPV_replace_var(char *dest,char *fmt,char *key,char *value)
{
    int32_t keylen,vlen,num=0; char *p = fmt;
    keylen = (int32_t)strlen(key);
    vlen = (int32_t)strlen(value);
    while ( 1 )
    {
        p = strstr(fmt,key);
        if ( p == NULL )
        {
            strcpy(dest,fmt);
            break;
        }
        num++;
        memcpy(dest,fmt,p - fmt);
        dest += p - fmt;
        memcpy(dest,value,vlen);
        dest += vlen;
        fmt = p + keylen;
    }
    return(num);
}

void NSPV_expand_variable(char *bigbuf,char **filestrp,char *key,char *value)
{
    int32_t len;
    if ( key != 0 && value != 0 && NSPV_replace_var(bigbuf,*filestrp,key,value) != 0 )
    {
        free(*filestrp);
        len = (int32_t)strlen(bigbuf);
        *filestrp = malloc(len+1);
        strcpy(*filestrp,bigbuf);
    }
}

char *NSPV_script_to_address(char *destaddr,char *scriptstr)
{
    uint8_t *script; btc_pubkey pk; uint8_t hash160[sizeof(uint160)+1]; int32_t len;
    len = (int32_t)strlen(scriptstr) >> 1;
    strcpy(destaddr,"unknown");
    script = malloc(len);
    decode_hex(script,len,scriptstr);
    memset(hash160,0,sizeof(hash160));
    hash160[0] = NSPV_chain->b58prefix_pubkey_address;
    if ( len == 35 )
    {
        if ( script[0] == 33 && script[34] == OP_CHECKSIG )
        {
            memset(&pk,0,sizeof(pk));
            pk.compressed = true;
            memcpy(pk.pubkey,script+1,33);
            btc_pubkey_get_hash160(&pk,hash160+1);
        }
    }
    else if ( len == 25 )
    {
        if ( script[0] == OP_DUP && script[1] == OP_HASH160 && script[2] == 20 && script[23] == OP_EQUALVERIFY && script[24] == OP_CHECKSIG )
            memcpy(&hash160[1],script+3,20);
    }
    else if ( len == 23 )
    {
        if ( script[0] == OP_HASH160 && script[1] == 20 && script[22] == OP_EQUAL )
        {
            hash160[0] = NSPV_chain->b58prefix_script_address;
            memcpy(&hash160[1],script+2,20);
        }
    }
    else return(destaddr);
    btc_base58_encode_check(hash160,sizeof(hash160),destaddr,100);
    return(destaddr);
}

void NSPV_expand_vinvout(char *bigbuf,char **filestrp,cJSON *txobj,char *replacestr)
{
//{"nVersion":4,"vin":[],"vout":[{"value":1,"scriptPubKey":"76a914bed47f9cda72a1bf743257617d7a5a1b2a68216688ac"}, {"value":140855.3434,"scriptPubKey":"210286de5bd7831baacc55b87cdf14a1938b2f2ab905529c739c82709c2993cfeafcac"}],"nLockTime":0,"nExpiryHeight":0,"valueBalance":0}
// == Send Validate page array variables ==
// $SEND_TXVIN_ARRAY - Main array variable defined in send_validate page for Tx-Vin table
//
// $SEND_TXVIN_ARRAYNUM - object location in array. Example arr[0], arr[1] etc.
// $SEND_TXVIN_TXID - txid
// $SEND_TXVIN_VOUT - vout
// $SEND_TXVIN_AMOUNT - amount
// $SEND_TXVIN_SCRIPTSIG - scriptSig
// $SEND_TXVIN_SEQID - sequenceid
    char *origitemstr,*itemstr,itembuf[32768],*itemsbuf,str[256]; int32_t i,num; long fsize; cJSON *vins,*vouts,*item;
    if ( (origitemstr= OS_filestr(&fsize,"html/send_validate_txvin_table_row.inc")) != 0 )
    {
        if ( (vins= jarray(&num,txobj,"vin")) != 0 )
        {
            itemsbuf = calloc(num,16384);
            for (i=0; i<num; i++)
            {
                item = jitem(vins,i);
                //fprintf(stderr,"vin %d.(%s)\n",i,jprint(item,0));
                if ( (itemstr= clonestr(origitemstr)) != 0 )
                {
                    sprintf(replacestr,"%d",i);
                    NSPV_expand_variable(itembuf,&itemstr,"$SEND_TXVIN_ARRAYNUM",replacestr);
                    NSPV_expand_variable(itembuf,&itemstr,"$SEND_TXVIN_TXID",jstr(item,"txid"));
                    sprintf(replacestr,"%d",jint(item,"vout"));
                    NSPV_expand_variable(itembuf,&itemstr,"$SEND_TXVIN_VOUT",replacestr);
                    NSPV_expand_variable(itembuf,&itemstr,"$SEND_TXVIN_AMOUNT","remove");
                    sprintf(replacestr,"%u",jint(item,"sequenceid"));
                    NSPV_expand_variable(itembuf,&itemstr,"$SEND_TXVIN_SEQID",replacestr);
                    NSPV_expand_variable(itembuf,&itemstr,"$SEND_TXVIN_SCRIPTSIG",jstr(item,"scriptSig"));

                    strcat(itemsbuf,itemstr);
                    //fprintf(stderr,"itemstr.(%s)\n",itemstr);
                    itembuf[0] = 0;
                    free(itemstr);
                }
            }
            NSPV_expand_variable(bigbuf,filestrp,"$SEND_TXVIN_ARRAY",itemsbuf);
            free(itemsbuf);
            itemsbuf = 0;
        }
        free(origitemstr);
        origitemstr = 0;
    }
    // $SEND_TXVOUT_ARRAY - Main array variable defined in send_validate page for Tx-Vout table
    //
    // $SEND_TXVOUT_ARRAYNUM - object location in array. Example arr[0], arr[1] etc.
    // $SEND_TXVOUT_VALUE - value
    // $SEND_TXVOUT_ADDR - Address. This is in place of scriptPubKey.
    if ( (origitemstr= OS_filestr(&fsize,"html/send_validate_txvout_table_row.inc")) != 0 )
    {
        if ( (vouts= jarray(&num,txobj,"vout")) != 0 )
        {
            itemsbuf = calloc(num,16384);
            for (i=0; i<num; i++)
            {
                item = jitem(vouts,i);
                if ( (itemstr= clonestr(origitemstr)) != 0 )
                {
                    sprintf(replacestr,"%d",i);
                    NSPV_expand_variable(itembuf,&itemstr,"$SEND_TXVOUT_ARRAYNUM",replacestr);
                    sprintf(replacestr,"%.8f",dstr((uint64_t)(jdouble(item,"value")*SATOSHIDEN+0.0000000049)));
                    NSPV_expand_variable(itembuf,&itemstr,"$SEND_TXVOUT_VALUE",replacestr);
                    NSPV_expand_variable(itembuf,&itemstr,"$SEND_TXVOUT_ADDR",NSPV_script_to_address(str,jstr(item,"scriptPubKey")));
                    
                    strcat(itemsbuf,itemstr);
                    itembuf[0] = 0;
                    free(itemstr);
                }
            }
            NSPV_expand_variable(bigbuf,filestrp,"$SEND_TXVOUT_ARRAY",itemsbuf);
            free(itemsbuf);
            itemsbuf = 0;
        }
        free(origitemstr);
    }
}

char *NSPV_expand_variables(char *bigbuf,char *filestr,char *method,cJSON *argjson)
{
    char replacestr[8192]; int32_t i,n; cJSON *retjson,*item;
    if ( method == 0 )
        method = "";
    if ( NSPV_chain == 0 )
    {
        free(bigbuf);
        return(filestr);
    }
    // == Menu Buttons array variables ==
    // $MENU_BUTTON_ARRAY - Main array variable defined in ALL pages to show buttons conditionally
    //
    // Top menu buttons HTML tags variables to use with
    // conditional logic to show/hide in cases when user is logged in or logged out
    //
     NSPV_expand_variable(bigbuf,&filestr,"$MENU_BUTTON_ARRAY","<a class=\"btn btn-outline-primary mr-sm-1\" href=\"$URL/method/wallet?nexturl=wallet\">$MENU_MENU_WALLET</a> <a class=\"btn btn-outline-info mr-sm-1\" href=\"$URL/method/getinfo?nexturl=info\">$MENU_MENU_INFO</a> <a class=\"btn btn-outline-secondary mr-sm-1\" href=\"$URL/method/getpeerinfo?nexturl=peerinfo\">$MENU_MENU_PEERS</a> <a class=\"btn btn-outline-success mr-sm-1\" href=\"$URL/method/index?nexturl=index\">$MENU_MENU_ACCOUNT</a> <a class=\"btn btn-outline-danger mr-sm-1\" href=\"$URL/method/logout?nexturl=index\">$MENU_MENU_LOGOUT</a>");

    // == Coin specific gloabal variable
    // $COINNAME - Display name from the "coins" file. The JSON object "fname" need to be used to display full name of the coin
    // $REWARDS_DISPLAY_KMD - If KMD coin is active
    //         REWARDS_DISPLAY_KMD=""
    //      else
    //         REWARDS_DISPLAY_KMD="none"

    // == Getinfo page variables ==
    // $PEERSTOTAL - Total Connected Peers
    // $PROTOVER - Protocol Version
    // $LASTPEER - Last connected Peers
    // $NTZTXID - Notarised Txid
    // $NTZTXIDHT - Notarised Txid Height
    // $NTZDESTTXID - Notarised Destination Txid
    // $NETBYTEIN - Network Bytes Recieved
    // $NETBYTEOUT - Network Bytes Sent
    
    // $BLKHDR - Block Header
    // $BLKHASH - Block Hash
    // $PREVBLKHASH - Previous Block Hash
    // $MERKLEHASH - Merkle Root Hash
    // $NTIME - nTime
    // $NBITS - nBits
    // == Get New Address page variables ==
    // $GENADDR - Login page has this section by default hidden.
    //      If URL is = $URL/method/index?nexturl=genaddr
    //         GENADDR=""
    //      else
    //          GENADDR="none"
    // $NEW_WALLETADDR - New wallet address
    // $NEW_WIFKEY - New wallet address's Private/WIF key
    // $NEW_PUBKEY - New wallet address's Public key
    // $LOGINDISPLAY - If Logged in set to "". Else "none"
    // $LOGOUTDISPLAY - If NOT Logged in set to "". Else "none"
    if ( jstr(argjson,"walletlang") != 0 )
        strcpy(NSPV_language,jstr(argjson,"walletlang"));
    if ( strcmp(NSPV_chain->name,"KMD") == 0 )
        NSPV_expand_variable(bigbuf,&filestr,"$REWARDS_DISPLAY_KMD","");
    else NSPV_expand_variable(bigbuf,&filestr,"$REWARDS_DISPLAY_KMD","none");
    {
        char *addr,*wif,*pub;
        retjson = NSPV_getnewaddress(NSPV_chain,jstr(argjson,"lang"));
        if ( retjson != 0 )
        {
            addr = jstr(retjson,"address");
            wif = jstr(retjson,"wif");
            pub = jstr(retjson,"pubkey");
            if ( addr != 0 && wif != 0 && pub != 0 )
            {
                strcpy(replacestr,addr);
                NSPV_expand_variable(bigbuf,&filestr,"$NEW_WALLETADDR",replacestr);
                strcpy(replacestr,wif);
                NSPV_expand_variable(bigbuf,&filestr,"$NEW_WIFKEY",replacestr);
                strcpy(replacestr,pub);
                NSPV_expand_variable(bigbuf,&filestr,"$NEW_PUBKEY",replacestr);
                NSPV_expand_variable(bigbuf,&filestr,"$WALLETSEED",NSPV_tmpseed);
            }
            free_json(retjson);
        }
    }
    if ( strcmp(method,"logout") == 0 )
        NSPV_logout();
    else if ( strcmp(method,"getinfo") == 0 )
    {
        sprintf(replacestr,"%u",btc_node_group_amount_of_connected_nodes(NSPV_client->nodegroup, NODE_CONNECTED));
        NSPV_expand_variable(bigbuf,&filestr,"$PEERSTOTAL",replacestr);
        
        sprintf(replacestr,"%08x",NSPV_PROTOCOL_VERSION);
        NSPV_expand_variable(bigbuf,&filestr,"$PROTOVER",replacestr);
        sprintf(replacestr,"%u", NSPV_longestchain);
        NSPV_expand_variable(bigbuf,&filestr,"$CURHEIGHT",replacestr);
        
        sprintf(replacestr,"%u", NSPV_inforesult.notarization.height);
        NSPV_expand_variable(bigbuf,&filestr,"$NTZHEIGHT",replacestr);
        bits256_str(replacestr,NSPV_inforesult.notarization.blockhash);
        NSPV_expand_variable(bigbuf,&filestr,"$NTZBLKHASH",replacestr);
        sprintf(replacestr,"%u", NSPV_inforesult.notarization.txidheight);
        NSPV_expand_variable(bigbuf,&filestr,"$NTZTXIDHT",replacestr);
        bits256_str(replacestr,NSPV_inforesult.notarization.txid);
        NSPV_expand_variable(bigbuf,&filestr,"$NTZTXID",replacestr);
        bits256_str(replacestr,NSPV_inforesult.notarization.othertxid);
        NSPV_expand_variable(bigbuf,&filestr,"$NTZDESTTXID",replacestr);
        
        sprintf(replacestr,"%u", NSPV_inforesult.hdrheight);
        NSPV_expand_variable(bigbuf,&filestr,"$BLKHDR",replacestr);
        sprintf(replacestr,"%u", NSPV_inforesult.H.nTime);
        NSPV_expand_variable(bigbuf,&filestr,"$NTIME",replacestr);
        sprintf(replacestr,"%08x", NSPV_inforesult.H.nBits);
        NSPV_expand_variable(bigbuf,&filestr,"$NBITS",replacestr);
        bits256_str(replacestr,NSPV_hdrhash(&NSPV_inforesult.H));
        NSPV_expand_variable(bigbuf,&filestr,"$BLKHASH",replacestr);
        bits256_str(replacestr,NSPV_inforesult.H.hashPrevBlock);
        NSPV_expand_variable(bigbuf,&filestr,"$PREVBLKHASH",replacestr);
        bits256_str(replacestr,NSPV_inforesult.H.hashMerkleRoot);
        NSPV_expand_variable(bigbuf,&filestr,"$MERKLEHASH",replacestr);
    }
    
    // == Transactions detail (txidinfo) page variables - spentinfo API ==
    // -$TXINFO_TXID - Txid
    // -$TXINFO_VOUT - vout
    // -$TXINFO_SPENTHT - spent height
    // -$TXINFO_SPENTTXID - spent txid
    // -$TXINFO_SPENTVINI - spent vini
    // -$TXINFO_SPENTTXLEN - spent transaction length
    // -$TXINFO_SPENTTXPROOFLEN - Spent Transaction Proof Length
    // -$TXIDHEX - hex
    // -$TXIDPROOF - proof
    else if ( strcmp(method,"txidinfo") == 0 )
    {
        int32_t vout = jint(argjson,"vout"), height = jint(argjson,"height");
        NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_TXID",jstr(argjson,"txid"));
        sprintf(replacestr,"%d",vout);
        if ( jstr(argjson,"vout") == 0 || strcmp(jstr(argjson,"vout"),"ignore") != 0 )
        {
            NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_VOUT",replacestr);
            NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_VIN","ignore");
            if ( (retjson= NSPV_spentinfo(NSPV_client,jbits256(argjson,"txid"),vout)) != 0 )
            {
                if ( jint(retjson,"spentheight") > 0 )
                {
                    sprintf(replacestr,"%d",jint(retjson,"spentheight"));
                    NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTHT",replacestr);
                    NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTTXID",jstr(retjson,"spenttxid"));
                    sprintf(replacestr,"%d",jint(retjson,"spentvini"));
                    NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTVINI",replacestr);
                    sprintf(replacestr,"%d",jint(retjson,"spenttxlen"));
                    NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTTXLEN",replacestr);
                    sprintf(replacestr,"%d",jint(retjson,"spenttxprooflen"));
                    NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTTXPROOFLEN",replacestr);
                }
                else
                {
                    NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTHT","0");
                    NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTTXID","unspent");
                    NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTVINI","unspent");
                    NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTTXLEN","0");
                    NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTTXPROOFLEN","0");
                }
                free_json(retjson);
            }
        }
        else
        {
            NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_VIN",replacestr);
            NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_VOUT","ignore");
            NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTHT","N/A");
            NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTTXID","N/A");
            NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTVINI","N/A");
            NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTTXLEN","N/A");
            NSPV_expand_variable(bigbuf,&filestr,"$TXINFO_SPENTTXPROOFLEN","N/A");
            vout = 0;
        }
        if ( (retjson= NSPV_txproof(1,NSPV_client,vout,jbits256(argjson,"txid"),height)) != 0 )
        {
            if ( jstr(retjson,"hex") != 0 )
            {
                btc_tx *tx; cJSON *txobj;
                NSPV_expand_variable(bigbuf,&filestr,"$TXIDHEX",jstr(retjson,"hex"));
                NSPV_expand_variable(bigbuf,&filestr,"$TXIDPROOF",jstr(retjson,"proof"));
                if ( (tx= btc_tx_decodehex(jstr(retjson,"hex"))) != 0 )
                {
                    if ( (txobj= btc_tx_to_json(tx)) != 0 )
                    {
                        NSPV_expand_vinvout(bigbuf,&filestr,txobj,replacestr);
                        free_json(txobj);
                    }
                    btc_tx_free(tx);
                }
            }
            free_json(retjson);
        }
    }
    else if ( strcmp(method,"broadcast") == 0 )
    {
        // == Broadcast page variables ==
        // $BDCAST_RESULT - broadcast API result output
        // $BDCAST_EXPECTED - expected txid
        // $BDCAST_TXID - broadcasted txid
        // $BDCAST_RETCODE - retcode from broadcast API
        // $BDCAST_TYPE - broadcast type
        if ( jstr(argjson,"hex") != 0 && is_hexstr(jstr(argjson,"hex"),0) > 64 && (retjson= NSPV_broadcast(NSPV_client,jstr(argjson,"hex"))) != 0 )
        {
            NSPV_expand_variable(bigbuf,&filestr,"$BDCAST_RESULT",jstr(retjson,"result"));
            NSPV_expand_variable(bigbuf,&filestr,"$BDCAST_EXPECTED",jstr(retjson,"expected"));
            NSPV_expand_variable(bigbuf,&filestr,"$BDCAST_TXID",jstr(retjson,"broadcast"));
            sprintf(replacestr,"%d",jint(retjson,"retcode"));
            NSPV_expand_variable(bigbuf,&filestr,"$BDCAST_RETCODE",replacestr);
            NSPV_expand_variable(bigbuf,&filestr,"$BDCAST_TYPE",jstr(retjson,"type"));
            free_json(retjson);
        }
        else
        {
            NSPV_expand_variable(bigbuf,&filestr,"$BDCAST_RESULT","error");
            NSPV_expand_variable(bigbuf,&filestr,"$BDCAST_EXPECTED","");
            NSPV_expand_variable(bigbuf,&filestr,"$BDCAST_TXID","");
            NSPV_expand_variable(bigbuf,&filestr,"$BDCAST_RETCODE","-1");
            NSPV_expand_variable(bigbuf,&filestr,"$BDCAST_TYPE","invalid hex");
        }
    }

    // == Peer info page array variables ==
    // $PEER_INFO_ROW_ARRAY - Main array variable defined in peerinfo page.
    // 
    // $PEER_NODEID - nodeid
    // $PEER_IPADDR - IP Address
    // $PEER_PORT - Port
    // $PEER_LASTPING - Last Ping
    // $PEER_TIMECONSTART - Time Started Conn.
    // $PEER_TIMELASTREQ - Time Last Req.
    // $PEER_SERVICES - Services
    // $PEER_MISBEHAVESCORE - Missbehave Score
    // $PEER_BESTKNOWNHT - Best Known Height
    // $PEER_INSYNC - In Sync
    else if ( strcmp(method,"getpeerinfo") == 0 )
    {
        char *origitemstr,*itemstr,itembuf[1024],*itemsbuf; long fsize; int32_t lastht;
        if ( (origitemstr= OS_filestr(&fsize,"html/getpeerinfo_table_row.inc")) != 0 )
        {
            if ( (retjson= NSPV_getpeerinfo(NSPV_client)) != 0 )
            {
                if ( (n= cJSON_GetArraySize(retjson)) > 0 )
                {
                    itemsbuf = calloc(n,1024);
                    for (i=0; i<n; i++)
                    {
                        item = jitem(retjson,i);
                        if ( (itemstr= clonestr(origitemstr)) != 0 )
                        {
                            sprintf(replacestr,"%d",jint(item,"nodeid"));
                            NSPV_expand_variable(itembuf,&itemstr,"$PEER_NODEID",replacestr);
                            NSPV_expand_variable(itembuf,&itemstr,"$PEER_IPADDR",jstr(item,"ipaddress"));
                            sprintf(replacestr,"%u",NSPV_chain->default_port);
                            NSPV_expand_variable(itembuf,&itemstr,"$PEER_PORT",replacestr);
                            sprintf(replacestr,"%u",juint(item,"lastping"));
                            NSPV_expand_variable(itembuf,&itemstr,"$PEER_LASTPING",replacestr);
                            sprintf(replacestr,"%u",juint(item,"time_started_con"));
                            NSPV_expand_variable(itembuf,&itemstr,"$PEER_TIMECONSTART",replacestr);
                            sprintf(replacestr,"%u",juint(item,"time_last_request"));
                            NSPV_expand_variable(itembuf,&itemstr,"$PEER_TIMELASTREQ",replacestr);
                            sprintf(replacestr,"%llx",(long long)j64bits(item,"services"));
                            NSPV_expand_variable(itembuf,&itemstr,"$PEER_SERVICES",replacestr);
                            sprintf(replacestr,"%u",juint(item,"missbehavescore"));
                            NSPV_expand_variable(itembuf,&itemstr,"$PEER_MISBEHAVESCORE",replacestr);
                            sprintf(replacestr,"%u",juint(item,"bestknownheight"));
                            NSPV_expand_variable(itembuf,&itemstr,"$PEER_BESTKNOWNHT",replacestr);
                            lastht = juint(item,"last_validated_header");
                            sprintf(replacestr,"%u",lastht);
                            NSPV_expand_variable(itembuf,&itemstr,"$PEER_INSYNC",replacestr);
                            strcat(itemsbuf,itemstr);
                            itembuf[0] = 0;
                            free(itemstr);
                        }
                    }
                    NSPV_expand_variable(bigbuf,&filestr,"$PEER_INFO_ROW_ARRAY",itemsbuf);
                    free(itemsbuf);
                }
                free_json(retjson);
            }
            free(origitemstr);
        }
    }

    if ( strcmp(method,"wallet") == 0 )
    {
        char *origitemstr,*itemstr,itembuf[1024],*itemsbuf; int64_t satoshis; long fsize; struct NSPV_txidresp *ptr; int32_t didflag = 0;
        if ( jint(argjson,"update") != 0 )
        {
            if ( NSPV_address[0] != 0 )
            {
                NSPV_coinaddr_inmempool(NSPV_client,"",NSPV_address,0);
                if ( (origitemstr= OS_filestr(&fsize,"html/wallet_mempool_table_row.inc")) != 0 )
                {
                    int32_t z;
                    //for (z=0; z<4; z++) fprintf(stderr,"%016llx ",(long long)NSPV_mempoolresult.txid.ulongs[z]);
                    //fprintf(stderr," inside loop with %d mempool\n",NSPV_mempoolresult.numtxids);
                    itemsbuf = calloc(NSPV_mempoolresult.numtxids+1,1024);
                    // $MEMP_ROW_ARRAY - Main array variable defined in wallet page for Mempool transactions table
                    // $MEMP_TYPE - Type
                    // $MEMP_DEST - Destination Address
                    // $MEMP_AMOUNT - Amount sent in this transaction
                    // $MEMP_TXID - Transaction ID
                    //iguana_rwnum(1,(uint8_t *)&satoshis,sizeof(satoshis),(void *)&NSPV_mempoolresult.txid.ulongs[7]);
                    for (i=0; i<NSPV_mempoolresult.numtxids && i<1000; i++)
                    {
                        if ( i < 4 )
                        {
                            for (z=0; z<8; z++)
                                ((uint8_t *)&satoshis)[z] = ((uint8_t *)&NSPV_mempoolresult.txid.ulongs[3-i])[7-z];
                        }
                        else satoshis = 0;
                        if ( (itemstr= clonestr(origitemstr)) != 0 )
                        {
                            strcpy(replacestr,"<span class=\"badge badge-success\">IN</span>");
                            NSPV_expand_variable(itembuf,&itemstr,"$MEMP_TYPE",replacestr);
                            NSPV_expand_variable(itembuf,&itemstr,"$MEMP_DEST",NSPV_address);
                            sprintf(replacestr,"%.8f",dstr(satoshis));
                            NSPV_expand_variable(itembuf,&itemstr,"$MEMP_AMOUNT",replacestr);
                            bits256_str(replacestr,NSPV_mempoolresult.txids[i]);
                            NSPV_expand_variable(itembuf,&itemstr,"$MEMP_TXID",replacestr);
                            strcat(itemsbuf,itemstr);
                            itembuf[0] = 0;
                            free(itemstr);
                        }
                    }
                    NSPV_expand_variable(bigbuf,&filestr,"$MEMP_ROW_ARRAY",itemsbuf);
                    didflag = 1;
                    free(itemsbuf);
                    free(origitemstr);
                }
            }
        }
        else
        {
            if ( (retjson= NSPV_addresstxids(0,NSPV_client,NSPV_address,0,0,0)) != 0 )
                free_json(retjson);
            if ( (retjson= NSPV_addressutxos(1,NSPV_client,NSPV_address,0,0,0)) != 0 )
                free_json(retjson);
        }
        retjson = 0;
        if ( didflag == 0 )
            NSPV_expand_variable(bigbuf,&filestr,"$MEMP_ROW_ARRAY","");
        didflag = 0;
        if ( (origitemstr= OS_filestr(&fsize,"html/wallet_tx_history_table_row.inc")) != 0 )
        {
            // == Wallet page array variables ==
            // $TXHIST_ROW_ARRAY - Main array vairable defined in wallet page for tx history table
            //
            // $TXHIST_TYPE - Type of the transaction. Public/Private. Need to show relevat HTML tag
            // $TXHIST_DIR_ARRAY - Direction of transaction. IN/OUT/MINTED + dPOW tag if dPoWed.
            // $TXHIST_CONFIRMS - Confirmations
            // $TXHIST_AMOUNT - Amount
            // $TXHIST_DATETIME - Date and time. Example output "23 Jul 2019 15:08"
            // $TXHIST_DESTADDDR - Destination address
            // $TXHIST_TXID - txid of the transaction. When user clicks on "Details" button it should go to txidinfo page
            // Transactions History table HTML tags variables to use in
            // conditional logic in displaying table rows and columns
            //
            // TXHIST_TYPE_PUBLIC_TAG="<span class=\"badge badge-secondary\">public</span>";
            // TXHIST_TYPE_PRIVATE_TAG="<span class="badge badge-dark">private</span>";
            // TXHIST_DIR_MINTED_TAG="<span class=\"badge badge-light\">Minted</span>";
            // TXHIST_DIR_OUT_TAG="<span class=\"badge badge-danger\">OUT</span>";
            // TXHIST_DIR_IN_TAG="<span class=\"badge badge-success\">IN</span>";
            // TXHIST_DIR_DPOW_TAG="<span class=\"badge badge-info\">dPoW Secured</span>";
            // TXHIST_DESTADDR_PRIVADDR_TAG="<span class=\"badge badge-dark\">Address not listed by wallet</span>";
            //
            if ( strcmp(NSPV_address,NSPV_txidsresult.coinaddr) == 0 )
            {
                itemsbuf = calloc(NSPV_txidsresult.numtxids+1,2048);
                for (i=NSPV_txidsresult.numtxids-1; i>=0; i--)
                {
                    if ( i < NSPV_txidsresult.numtxids-1000 )
                        break;
                    ptr = &NSPV_txidsresult.txids[i];
                    if ( (itemstr= clonestr(origitemstr)) != 0 )
                    {
                        satoshis = ptr->satoshis;
                        if ( ptr->satoshis > 0 )
                        {
                            sprintf(replacestr,"%d",ptr->vout);
                            NSPV_expand_variable(itembuf,&itemstr,"$TXHIST_VOUT",replacestr);
                            NSPV_expand_variable(itembuf,&itemstr,"$TXHIST_VIN","ignore");
                            strcpy(replacestr,"<span class=\"badge badge-success\">IN</span>");
                            if ( ptr->vout != 0 && i > 0 && bits256_cmp(NSPV_txidsresult.txids[i-1].txid,ptr->txid) == 0 && NSPV_txidsresult.txids[i-1].satoshis < 0 )
                                strcat(replacestr,"  <span class=\"badge badge-primary\">CHANGE</span>");
                         }
                        else
                        {
                            sprintf(replacestr,"%d",ptr->vout);
                            NSPV_expand_variable(itembuf,&itemstr,"$TXHIST_VIN",replacestr);
                            NSPV_expand_variable(itembuf,&itemstr,"$TXHIST_VOUT","ignore");
                            satoshis = -satoshis;
                            strcpy(replacestr,"<span class=\"badge badge-danger\">OUT</span>");
                        }
                        if ( ptr->height <= NSPV_lastntz.height )
                            strcat(replacestr,"  <span class=\"badge badge-info\">dPoW</span>");
                        NSPV_expand_variable(itembuf,&itemstr,"$TXHIST_DIR_ARRAY",replacestr);
                        sprintf(replacestr,"%d",NSPV_inforesult.height-ptr->height+1);
                        NSPV_expand_variable(itembuf,&itemstr,"$TXHIST_CONFIRMS",replacestr);
                        sprintf(replacestr,"%.8f",dstr(satoshis));
                        NSPV_expand_variable(itembuf,&itemstr,"$TXHIST_AMOUNT",replacestr);
                        sprintf(replacestr,"%d",ptr->height);
                        NSPV_expand_variable(itembuf,&itemstr,"$TXHIST_HEIGHT",replacestr);
                        bits256_str(replacestr,ptr->txid);
                        NSPV_expand_variable(itembuf,&itemstr,"$TXHIST_TXID",replacestr);
                        strcat(itemsbuf,itemstr);
                        itembuf[0] = 0;
                        free(itemstr);
                    }
                }
                NSPV_expand_variable(bigbuf,&filestr,"$TXHIST_ROW_ARRAY",itemsbuf);
                didflag = 1;
                free(itemsbuf);
            }
            free(origitemstr);
        }
        if ( didflag == 0 )
            NSPV_expand_variable(bigbuf,&filestr,"$TXHIST_ROW_ARRAY","");
    }
    // == Send pages variables ==
    // $REWARDS - Rewards accrued by the logged in wallet address
    // $TOADDR - To address filled by user input and taken from send page
    // $SENDAMOUNT - Amount filled by the user input taken from send page
    // $REWARDSVLD - Validated Rewards calculated from local and network info
    // $TXFEE - Transaction fee included in amount being sent
    // $TOTALAMOUNT - Total amount being sent. Amount + Tx Fee
    // $SPENDRETCODE - retcode value from spend API
    // $SENDTXID - TXID generated by creating a transaction using spend API
    // $SENDHEX - HEX generated by create a transaction using spend API
    // $SENDNVER - nVersion
    // $SENDNLOCKTIME - nLockTime
    // $SENDNEXPIRYHT - nExpiryHeight
    // $SENDVALBAL - valueBalance
    // $CHANGEAMOUNT - Change amount
    else if ( strcmp(method,"send") == 0 )
    {
        if ( strcmp(NSPV_utxosresult.coinaddr,NSPV_address) == 0 && NSPV_didfirsttxproofs == 0 )
        {
            NSPV_didfirsttxproofs = NSPV_utxosresult.numutxos;
            fprintf(stderr,"fetch %d txids\n",NSPV_didfirsttxproofs);
        }
    }
    else if ( strcmp(method,"send_confirm") == 0 || strcmp(method,"send_validate") == 0 )
    {
        char *dest,*tmpstr; int64_t satoshis; cJSON *txobj,*retcodes;
        dest = jstr(argjson,"address");
        satoshis = jdouble(argjson,"amount")*SATOSHIDEN + 0.0000000049;
        if ( dest != 0 && satoshis != 0 )
        {
            NSPV_expand_variable(bigbuf,&filestr,"$TOADDR",dest);
            if ( satoshis > (NSPV_utxosresult.total+NSPV_utxosresult.interest-10000) )
                satoshis = (NSPV_utxosresult.total+NSPV_utxosresult.interest-10000);
            sprintf(replacestr,"%.8f",dstr(satoshis));
            NSPV_expand_variable(bigbuf,&filestr,"$SENDAMOUNT",replacestr);
            if ( strcmp(method,"send_validate") == 0 )
            {
                if ( (retjson= NSPV_spend(NSPV_client,NSPV_address,dest,satoshis)) != 0 )
                {
//got.({"txfee":"0.00010000","total":"140856.34350000","change":"140855.34340000","txid":"aa19764684e3c6dda23de3a4989d16d6568b41d87777dce2fca18e8548f57633","tx":{"nVersion":4,"vin":[{"txid":"f5ae0bb2491198f5b4d435a990bb1ba870a5800cb308b2980b0393a89b39d0f6","vout":1,"scriptSig":"473044022055857a361c31f99b1bacb518597aee57e37b430f537d158ad21888a0330700ea02204734f66d49472319534001f187f402993d6bb80398aefc92d90893204ec23ea301","sequenceid":4294967295}],"vout":[{"value":1,"scriptPubKey":"76a914bed47f9cda72a1bf743257617d7a5a1b2a68216688ac"}, {"value":140855.3434,"scriptPubKey":"210286de5bd7831baacc55b87cdf14a1938b2f2ab905529c739c82709c2993cfeafcac"}],"nLockTime":0,"nExpiryHeight":0,"valueBalance":0},"result":"success","hex":"0400008085202f8901f6d0399ba893030b98b208b30c80a570a81bbb90a935d4b4f5981149b20baef50100000048473044022055857a361c31f99b1bacb518597aee57e37b430f537d158ad21888a0330700ea02204734f66d49472319534001f187f402993d6bb80398aefc92d90893204ec23ea301ffffffff0200e1f505000000001976a914bed47f9cda72a1bf743257617d7a5a1b2a68216688aca053458bcf0c000023210286de5bd7831baacc55b87cdf14a1938b2f2ab905529c739c82709c2993cfeafcac00000000000000000000000000000000000000","retcodes":[0],"lastpeer":"5.9.253.203:12985"})
//fprintf(stderr,"got.(%s)\n",jprint(retjson,0));
                    NSPV_expand_variable(bigbuf,&filestr,"$REWARDSVLD",jstr(retjson,"validated"));
                    NSPV_expand_variable(bigbuf,&filestr,"$REWARDSEXT",jstr(retjson,"rewards"));
                    NSPV_expand_variable(bigbuf,&filestr,"$TXFEE",jstr(retjson,"txfee"));
                    NSPV_expand_variable(bigbuf,&filestr,"$TOTALAMOUNT",jstr(retjson,"total"));
                    NSPV_expand_variable(bigbuf,&filestr,"$CHANGEAMOUNT",jstr(retjson,"change"));
                    fprintf(stderr,"change %s\n",jstr(retjson,"change"));
                    if ( (retcodes= jobj(retjson,"retcodes")) != 0 )
                    {
                        tmpstr = jprint(retcodes,0);
                        strcpy(replacestr,tmpstr);
                        free(tmpstr);
                        NSPV_expand_variable(bigbuf,&filestr,"$SPENDRETCODE",replacestr);
                    }
                    NSPV_expand_variable(bigbuf,&filestr,"$SENDHEX",jstr(retjson,"hex"));
                    NSPV_expand_variable(bigbuf,&filestr,"$SENDTXID",jstr(retjson,"txid"));
                    if ( (txobj= jobj(retjson,"tx")) != 0 )
                    {
                        sprintf(replacestr,"%u",juint(txobj,"nVersion"));
                        NSPV_expand_variable(bigbuf,&filestr,"$SENDNVER",(char *)replacestr);
                        sprintf(replacestr,"%u",juint(txobj,"nLockTime"));
                        NSPV_expand_variable(bigbuf,&filestr,"$SENDNLOCKTIME",(char *)replacestr);
                        sprintf(replacestr,"%d",juint(txobj,"nExpiryHeight"));
                        NSPV_expand_variable(bigbuf,&filestr,"$SENDNEXPIRYHT",(char *)replacestr);
                        sprintf(replacestr,"%lld",(long long)j64bits(txobj,"valueBalance"));
                        NSPV_expand_variable(bigbuf,&filestr,"$SENDVALBAL",(char *)replacestr);
                        NSPV_expand_vinvout(bigbuf,&filestr,txobj,replacestr);
                    }
                    free_json(retjson);
                }
            }
        }
    }
    NSPV_expand_variable(bigbuf,&filestr,"$LASTPEER",NSPV_lastpeer);
    NSPV_expand_variable(bigbuf,&filestr,"$COINNAME",(char *)NSPV_fullname);
    NSPV_expand_variable(bigbuf,&filestr,"$COIN",(char *)NSPV_chain->name);
    NSPV_expand_variable(bigbuf,&filestr,"$WALLETADDR",(char *)NSPV_address);
    sprintf(replacestr,"http://%s:%u",NSPV_externalip,NSPV_chain->rpcport);
    NSPV_expand_variable(bigbuf,&filestr,"$URL",replacestr);
    sprintf(replacestr,"%.8f",dstr(NSPV_balance));
    NSPV_expand_variable(bigbuf,&filestr,"$BALANCE",(char *)replacestr);
    sprintf(replacestr,"%.8f",dstr(NSPV_rewards));
    NSPV_expand_variable(bigbuf,&filestr,"$REWARDS",(char *)replacestr);
    sprintf(replacestr,"%llu",(long long)NSPV_totalsent);
    NSPV_expand_variable(bigbuf,&filestr,"$NETBYTEOUT",(char *)replacestr);
    sprintf(replacestr,"%llu",(long long)NSPV_totalrecv);
    NSPV_expand_variable(bigbuf,&filestr,"$NETBYTEIN",(char *)replacestr);
    NSPV_expand_variable(bigbuf,&filestr,"$LOGINDISPLAY",NSPV_logintime!=0?"":"none");
    NSPV_expand_variable(bigbuf,&filestr,"$LOGOUTDISPLAY",NSPV_logintime==0?"":"none");
    sprintf(replacestr,"%d",NSPV_AUTOLOGOUT - (int32_t)(time(NULL)-NSPV_logintime));
    NSPV_expand_variable(bigbuf,&filestr,"$AUTOLOGOUT",replacestr);

    // == Account Settings ==
    // $WALLET_LANG_OPTIONS_LIST - main array to list languages in drop down options
    // $WALLETLANG - name of the language file
    // $WALLETLANG_NAME - name from the language file. From key Langinfo.name

    // == Error page variable ==
    // $ERROR_OUTPUT - use it for displaying any error

    {
        char langfname[256]; char *langstr,*aname,*field,var[512]; long fsize; int32_t j,m; cJSON *langjson,*array,*item,*map;
        sprintf(langfname,"html/languages/%s.json",NSPV_language);
        if ( (langstr= OS_filestr(&fsize,langfname)) != 0 )
        {
            if ( (langjson= cJSON_Parse(langstr)) != 0 )
            {
                if ( (n= cJSON_GetArraySize(langjson)) > 0 )
                {
                    for (i=0; i<n; i++)
                    {
                        array = jitem(langjson,i);
                        aname = get_cJSON_fieldname(array);
                        array = jobj(array,aname);
                        if ( (m= cJSON_GetArraySize(array)) > 0 )
                        {
                            for (j=0; j<m; j++)
                            {
                                map = jitem(array,j);
                                field = get_cJSON_fieldname(map);
                                sprintf(var,"$%s_%s",aname,field);
                                NSPV_expand_variable(bigbuf,&filestr,var,jstr(map,field));
                            }
                        }
                    }
                }
                free_json(langjson);
            } else fprintf(stderr,"cant parse (%s)\n",langstr);
            free(langstr);
        } else fprintf(stderr,"cant open (%s)\n",langfname);
    }
    free(bigbuf);
    return(filestr);
}

char *NSPV_JSON(cJSON *argjson,char *remoteaddr,uint16_t port,char *filestr,int32_t apiflag) // from rpc port
{
    char *retstr,*method,*wifstr; long fsize; cJSON *retjson = 0;
    if ( filestr != 0 && apiflag == 0 )
    {
        if ( (method= jstr(argjson,"method")) != 0 )
        {
            if ( strcmp(method,"login") == 0 )
            {
                if ( (wifstr= jstr(argjson,"wif")) != 0 )
                {
                    if ( (retjson= NSPV_login(NSPV_chain,wifstr)) != 0 )
                    {
                        if ( NSPV_address[0] != 0 && NSPV_wifstr[0] != 0 )
                        {
                            free(filestr);
                            filestr = OS_filestr(&fsize,"html/wallet");
                            method = "wallet";
#ifdef ENABLE_JPEG
                            if ( (0) )
                            {
                                char srcstr[512],*retstr,*passphrase = "secret"; uint16_t ind; int32_t power2=3,len = (int32_t)strlen(NSPV_wifstr);
                                init_hexbytes_noT(srcstr,(uint8_t *)NSPV_wifstr,len);
                                fprintf(stderr,"login.(%s) -> %s\n",NSPV_wifstr,srcstr);
                                ind = 124;
                                if ( (retstr= LP_jpg("test.jpg","dest.jpg",power2,passphrase,srcstr,len*8,&ind)) != 0 )
                                {
                                    fprintf(stderr,"jpeg -> (%s)\n",retstr);
                                    free(retstr);
                                    ind = 0;
                                    if ( (retstr= LP_jpg("dest.jpg",0,power2,passphrase,0,len*8,&ind)) != 0 )
                                    {
                                        fprintf(stderr,"decode (%s) ind.%u\n",retstr,ind);
                                        free(retstr);
                                    }
                                }
                            }
#endif
                        } else fprintf(stderr,"login error with wif.(%s)\n",wifstr);
                        memset(wifstr,0,strlen(wifstr));
                        free_json(retjson);
                        retjson = 0;
                    }
                }
            }
            return(NSPV_expand_variables(calloc(4096,4096),filestr,method,argjson));
        }
        //fprintf(stderr,"NSPV filestr.%s\n",filestr);
        // extract data from retjson and put into filestr template
        //return(filestr);
    }
    if ( (strcmp(remoteaddr,"127.0.0.1") != 0 && strcmp(remoteaddr,NSPV_externalip) != 0) || port == 0 )
        fprintf(stderr,"remoteaddr %s:%u\n",remoteaddr,port);
    if ( (retjson= NSPV_JSON_process(argjson)) != 0 )
        retstr = jprint(retjson,0);
    else retstr = clonestr("{\"error\":\"unparseable retjson\"}");
    if ( retjson != 0 )
        free_json(retjson);
    return(retstr);
}

#endif // KOMODO_NSPVSUPERLITE_H
