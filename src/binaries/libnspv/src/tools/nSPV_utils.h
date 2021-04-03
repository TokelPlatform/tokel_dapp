
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

#ifndef NSPV_UTILS_H
#define NSPV_UTILS_H

/**
 * - we need to include WinSock2.h header to correctly use windows structure
 * as the application is still using 32bit structure from mingw so, we need to
 * add the include based on checking
 * @author - fadedreamz@gmail.com
 * @remarks - #if (defined(_M_X64) || defined(__amd64__)) && defined(WIN32)
 *     is equivalent to #if defined(_M_X64) as _M_X64 is defined for MSVC only
 */
#if defined(_M_X64)
#define WIN32_LEAN_AND_MEAN
#include <winsock2.h>
#endif
#ifdef _WIN32
#include <winsock2.h>
#endif

#ifdef _WIN32
#define PTW32_STATIC_LIB
#include "pthread.h"

#ifndef NATIVE_WINDOWS
#define EADDRINUSE WSAEADDRINUSE
#endif

#else
#include <netdb.h>
#include <poll.h>
#include <sys/time.h>
#include <time.h>
#define HAVE_STRUCT_TIMESPEC
#include <pthread.h>
#include <sys/mman.h>
#include <sys/socket.h>
#include <unistd.h>
#define closesocket close
#endif

#include <errno.h>

#ifndef _WIN32
#ifndef MSG_NOSIGNAL
#define MSG_NOSIGNAL 0x4000 // Do not generate SIGPIPE
#endif
#else
#define MSG_NOSIGNAL 0
#endif


static const bits256 zeroid;
portable_mutex_t NSPV_netmutex;

btc_chainparams kmd_chainparams_main =
{
    "KMD",
    60,
    85,
    "bc", // const char bech32_hrp[5]
    188,
    0x0488ADE4, // uint32_t b58prefix_bip32_privkey
    0x0488B21E, // uint32_t b58prefix_bip32_pubkey
    { 0xf9, 0xee, 0xe4, 0x8d },
    { 0x02, 0x7e, 0x37, 0x58, 0xc3, 0xa6, 0x5b, 0x12, 0xaa, 0x10, 0x46, 0x46, 0x2b, 0x48, 0x6d, 0x0a, 0x63, 0xbf, 0xa1, 0xbe, 0xae, 0x32, 0x78, 0x97, 0xf5, 0x6c, 0x5c, 0xfb, 0x7d, 0xaa, 0xae, 0x71 }, //{0x6f, 0xe2, 0x8c, 0x0a, 0xb6, 0xf1, 0xb3, 0x72, 0xc1, 0xa6, 0xa2, 0x46, 0xae, 0x63, 0xf7, 0x4f, 0x93, 0x1e, 0x83, 0x65, 0xe1, 0x5a, 0x08, 0x9c, 0x68, 0xd6, 0x19, 0x00, 0x00, 0x00, 0x00, 0x00},
    7770,7771,
    {{"45.32.19.196, 136.243.58.134"}, 0},
    60,
    170009,
    MAX_TX_SIZE_AFTER_SAPLING,
    1,1,0,
};

int32_t unhex(char c);

bits256 NSPV_seed_to_wif(char* newseed, int32_t maxlen, char* rawseed)
{
    bits256 privkey;
    int32_t a, b, c, n = 0;
    char* dest = newseed;
    while (n < maxlen && (c = rawseed[n]) != 0 && c != 0 && c != '\r' && c != '\n') {
        if (c == '%' && (a = rawseed[n + 1]) != 0 && (b = rawseed[n + 2]) != 0)
            c = ((unhex(a) << 4) | unhex(b)), n += 2;
        if (c == '+')
            c = ' ';
        *dest++ = c;
        n++;
    }
    newseed[n] = 0;
    sha256_Raw((uint8_t*)newseed, strlen(newseed), privkey.bytes);
    privkey.bytes[0] &= 248, privkey.bytes[31] &= 127, privkey.bytes[31] |= 64;
    if (0) {
        int32_t j;
        for (j = 0; j < 32; j++)
            fprintf(stderr, "%02x", privkey.bytes[j]);
        fprintf(stderr, " <- (%s) ", newseed);
        for (j = 0; newseed[j] != 0; j++)
            fprintf(stderr, "%02x", newseed[j] & 0xff);
        fprintf(stderr, "\n");
    }
    return (privkey);
}

int32_t OS_getline(int32_t waitflag, char* line, int32_t max, char* dispstr, FILE* fp)
{
    if (dispstr != 0 && dispstr[0] != 0)
        fprintf(stderr, "%s", dispstr);
    line[0] = 0;
#ifndef _WIN32
    if (waitflag == 0) {
        static char prevline[1024];
        struct timeval timeout;
        fd_set fdset;
        int32_t s;
        line[0] = 0;
        FD_ZERO(&fdset);
        FD_SET(STDIN_FILENO, &fdset);
        timeout.tv_sec = 0, timeout.tv_usec = 10000;
        if ((s = select(1, &fdset, NULL, NULL, &timeout)) < 0)
            fprintf(stderr, "wait_for_input: error select s.%d\n", s);
        else {
            if (FD_ISSET(STDIN_FILENO, &fdset) > 0 && fgets(line, max, stdin) == line) {
                line[strlen(line) - 1] = 0;
                if (line[0] == 0 || (line[0] == '.' && line[1] == 0))
                    strcpy(line, prevline);
                else
                    strcpy(prevline, line);
            }
        }
        return ((int32_t)strlen(line));
    }
#endif
    if (fgets(line, max, fp) != 0)
        line[strlen(line) - 1] = 0;
    return ((int32_t)strlen(line));
}

char* bits256_str(char* buf, bits256 hash)
{
    int32_t i;
    memset(buf, 0, sizeof(*buf));
    for (i = 0; i < 32; i++)
        sprintf(&buf[i << 1], "%02x", hash.bytes[i]);
    buf[i << 1] = 0;
    return (buf);
}

int32_t bits256_cmp(bits256 a, bits256 b)
{
    return (memcmp(a.bytes, b.bytes, sizeof(bits256)));
}

int32_t bits256_nonz(bits256 a)
{
    return (memcmp(a.bytes, zeroid.bytes, sizeof(bits256)));
}

bits256 bits256_doublesha256(uint8_t* data, int32_t datalen)
{
    bits256 hash, hash2;
    int32_t i;
    sha256_Raw(data, datalen, hash.bytes);
    sha256_Raw(hash.bytes, sizeof(hash), hash2.bytes);
    for (i = 0; i < (int32_t)sizeof(hash); i++)
        hash.bytes[i] = hash2.bytes[sizeof(hash) - 1 - i];
    return (hash);
}

bits256 NSPV_hdrhash(struct NSPV_equihdr* hdr)
{
    bits256 hash;
    int32_t len;
    uint8_t H[sizeof(*hdr) + 4];
    len = NSPV_rwequihdr(1, H, hdr, 1);
    hash = bits256_doublesha256(H, len);
    return (hash);
}

char hexbyte(int32_t c)
{
    c &= 0xf;
    if (c < 10)
        return ('0' + c);
    else if (c < 16)
        return ('a' + c - 10);
    else
        return (0);
}

int32_t init_hexbytes_noT(char* hexbytes, unsigned char* message, long len)
{
    int32_t i;
    if (len <= 0) {
        hexbytes[0] = 0;
        return (1);
    }
    for (i = 0; i < len; i++) {
        hexbytes[i * 2] = hexbyte((message[i] >> 4) & 0xf);
        hexbytes[i * 2 + 1] = hexbyte(message[i] & 0xf);
        //printf("i.%d (%02x) [%c%c]\n",i,message[i],hexbytes[i*2],hexbytes[i*2+1]);
    }
    hexbytes[len * 2] = 0;
    //printf("len.%ld\n",len*2+1);
    return ((int32_t)len * 2 + 1);
}

void touppercase(char* str)
{
    int32_t i;
    if (str == 0 || str[0] == 0)
        return;
    for (i = 0; str[i] != 0; i++)
        str[i] = toupper(((int32_t)str[i]));
}

void tolowercase(char* str)
{
    int32_t i;
    if (str == 0 || str[0] == 0)
        return;
    for (i = 0; str[i] != 0; i++)
        str[i] = tolower(((int32_t)str[i]));
}

char* uppercase_str(char* buf, char* str)
{
    if (str != 0) {
        strcpy(buf, str);
        touppercase(buf);
    } else
        buf[0] = 0;
    return (buf);
}

char* lowercase_str(char* buf, char* str)
{
    if (str != 0) {
        strcpy(buf, str);
        tolowercase(buf);
    } else
        buf[0] = 0;
    return (buf);
}

int32_t strsearch(char* strs[], int32_t num, char* name)
{
    int32_t i;
    char strA[32], refstr[32];
    strcpy(refstr, name), touppercase(refstr);
    for (i = 0; i < num; i++) {
        strcpy(strA, strs[i]), touppercase(strA);
        if (strcmp(strA, refstr) == 0)
            return (i);
    }
    return (-1);
}

int32_t is_decimalstr(char* str)
{
    int32_t i;
    if (str == 0 || str[0] == 0)
        return (0);
    for (i = 0; str[i] != 0; i++)
        if (str[i] < '0' || str[i] > '9')
            return (0);
    return (i);
}

int32_t unstringbits(char* buf, uint64_t bits)
{
    int32_t i;
    for (i = 0; i < 8; i++, bits >>= 8)
        if ((buf[i] = (char)(bits & 0xff)) == 0)
            break;
    buf[i] = 0;
    return (i);
}

uint64_t stringbits(char* str)
{
    uint64_t bits = 0;
    if (str == 0)
        return (0);
    int32_t i, n = (int32_t)strlen(str);
    if (n > 8)
        n = 8;
    for (i = n - 1; i >= 0; i--)
        bits = (bits << 8) | (str[i] & 0xff);
    //printf("(%s) -> %llx %llu\n",str,(long long)bits,(long long)bits);
    return (bits);
}

char* unstringify(char* str)
{
    int32_t i, j, n;
    if (str == 0)
        return (0);
    else if (str[0] == 0)
        return (str);
    n = (int32_t)strlen(str);
    if (str[0] == '"' && str[n - 1] == '"')
        str[n - 1] = 0, i = 1;
    else
        i = 0;
    for (j = 0; str[i] != 0; i++) {
        if (str[i] == '\\' && (str[i + 1] == 't' || str[i + 1] == 'n' || str[i + 1] == 'b' || str[i + 1] == 'r'))
            i++;
        else if (str[i] == '\\' && str[i + 1] == '"')
            str[j++] = '"', i++;
        else
            str[j++] = str[i];
    }
    str[j] = 0;
    return (str);
}

void reverse_hexstr(char* str)
{
    int i, n;
    char* rev;
    n = (int32_t)strlen(str);
    rev = (char*)malloc(n + 1);
    for (i = 0; i < n; i += 2) {
        rev[n - 2 - i] = str[i];
        rev[n - 1 - i] = str[i + 1];
    }
    rev[n] = 0;
    strcpy(str, rev);
    free(rev);
}

int32_t _unhex(char c)
{
    if (c >= '0' && c <= '9')
        return (c - '0');
    else if (c >= 'a' && c <= 'f')
        return (c - 'a' + 10);
    else if (c >= 'A' && c <= 'F')
        return (c - 'A' + 10);
    return (-1);
}

int32_t is_hexstr(char* str, int32_t n)
{
    int32_t i;
    if (str == 0 || str[0] == 0)
        return (0);
    for (i = 0; str[i] != 0; i++) {
        if (n > 0 && i >= n)
            break;
        if (_unhex(str[i]) < 0)
            break;
    }
    if (n == 0)
        return (i);
    return (i == n);
}

int32_t unhex(char c)
{
    int32_t hex;
    if ((hex = _unhex(c)) < 0) {
        //printf("unhex: illegal hexchar.(%c)\n",c);
    }
    return (hex);
}

unsigned char _decode_hex(char* hex) { return ((unhex(hex[0]) << 4) | unhex(hex[1])); }

int32_t decode_hex(uint8_t* bytes, int32_t n, char* hex)
{
    int32_t adjust, i = 0;

    if (n <= 0)  // prevent wrong mem access
        return 0;

    //printf("decode.(%s)\n",hex);
    if (is_hexstr(hex, n) <= 0) {
        memset(bytes, 0, n);
        return (n);
    }
    if (hex[n - 1] == '\n' || hex[n - 1] == '\r')
        hex[--n] = 0;
    if (n == 0 || (hex[n * 2 + 1] == 0 && hex[n * 2] != 0)) {
        if (n > 0) {
            bytes[0] = unhex(hex[0]);
            printf("decode_hex n.%d hex[0] (%c) -> %d hex.(%s) [n*2+1: %d] [n*2: %d %c] len.%ld\n", n, hex[0], bytes[0], hex, hex[n * 2 + 1], hex[n * 2], hex[n * 2], (long)strlen(hex));
        }
        bytes++;
        hex++;
        adjust = 1;
    } else
        adjust = 0;
    if (n > 0) {
        for (i = 0; i < n; i++)
            bytes[i] = _decode_hex(&hex[i * 2]);
    }
    //bytes[i] = 0;
    return (n + adjust);
}

long _stripwhite(char* buf, int accept)
{
    int32_t i, j, c;
    if (buf == 0 || buf[0] == 0)
        return (0);
    for (i = j = 0; buf[i] != 0; i++) {
        buf[j] = c = buf[i];
        if (c == accept || (c != ' ' && c != '\n' && c != '\r' && c != '\t' && c != '\b'))
            j++;
    }
    buf[j] = 0;
    return (j);
}

char* clonestr(char* str)
{
    char* clone;
    if (str == 0 || str[0] == 0) {
        printf("warning cloning nullstr.%p\n", (void*)str);
#ifdef __APPLE__
        while (1)
            sleep(1);
#endif
        str = (char*)"<nullstr>";
    }
    clone = (char*)malloc(strlen(str) + 32);
    strcpy(clone, str);
    return (clone);
}

int32_t safecopy(char* dest, char* src, long len)
{
    int32_t i = -1;
    if (src != 0 && dest != 0 && src != dest) {
        if (dest != 0)
            memset(dest, 0, len);
        for (i = 0; i < len && src[i] != 0; i++)
            dest[i] = src[i];
        if (i == len) {
            printf("safecopy: %s too long %ld\n", src, len);
#ifdef __APPLE__
            //getchar();
#endif
            return (-1);
        }
        dest[i] = 0;
    }
    return (i);
}

char* parse_conf_line(char* line, char* field)
{
    line += strlen(field);
    for (; *line != '=' && *line != 0; line++)
        break;
    if (*line == 0)
        return (0);
    if (*line == '=')
        line++;
    while (line[strlen(line) - 1] == '\r' || line[strlen(line) - 1] == '\n' || line[strlen(line) - 1] == ' ')
        line[strlen(line) - 1] = 0;
    //printf("LINE.(%s)\n",line);
    _stripwhite(line, 0);
    return (clonestr(line));
}

double OS_milliseconds()
{
    struct timeval tv;
    double millis;
    gettimeofday(&tv, NULL);
    millis = ((double)tv.tv_sec * 1000. + (double)tv.tv_usec / 1000.);
    //printf("tv_sec.%ld usec.%d %f\n",tv.tv_sec,tv.tv_usec,millis);
    return (millis);
}

char* OS_portable_path(char* str)
{
#ifdef _WIN32
    int32_t i;
    for (i = 0; str[i] != 0; i++)
        if (str[i] == '/')
            str[i] = '\\';
    return (str);
#else
#ifdef __PNACL
    /*int32_t i,n;
     if ( str[0] == '/' )
     return(str);
     else
     {
     n = (int32_t)strlen(str);
     for (i=n; i>0; i--)
     str[i] = str[i-1];
     str[0] = '/';
     str[n+1] = 0;
     }*/
#endif
    return (str);
#endif
}

void* OS_loadfile(char* fname, char** bufp, long* lenp, long* allocsizep)
{
    FILE* fp;
    long filesize, buflen = *allocsizep;
    char* buf = *bufp;
    *lenp = 0;
    if ((fp = fopen(OS_portable_path(fname), "rb")) != 0) {
        fseek(fp, 0, SEEK_END);
        filesize = ftell(fp);
        if (filesize == 0) {
            fclose(fp);
            *lenp = 0;
            //printf("OS_loadfile null size.(%s)\n",fname);
            return (0);
        }
        if (filesize > buflen - 1) {
            *allocsizep = filesize + 1;
            *bufp = buf = realloc(buf, (long)*allocsizep);
        }
        rewind(fp);
        if (buf == 0)
            printf("Null buf ???\n");
        else {
            if (fread(buf, 1, (long)filesize, fp) != (unsigned long)filesize)
                printf("error reading filesize.%ld\n", (long)filesize);
            buf[filesize] = 0;
        }
        fclose(fp);
        *lenp = filesize;
        //printf("loaded.(%s)\n",buf);
    } //else printf("OS_loadfile couldnt load.(%s)\n",fname);
    return (buf);
}

#if (defined(__ANDROID__) || defined(ANDROID)) && defined(LIBNSPV_BUILD)
char* coinsCached = NULL;
#endif

void* OS_filestr(long* allocsizep, char* _fname)
{
    long filesize = 0;
    char *fname, *buf = 0;
    void* retptr;
    *allocsizep = 0;
    fname = malloc(strlen(_fname) + 1);
    strcpy(fname, _fname);
#if (defined(__ANDROID__) || defined(ANDROID)) && defined(LIBNSPV_BUILD)
    retptr = NULL;
    if (coinsCached) {
        *allocsizep = strlen(coinsCached);
        retptr = malloc(*allocsizep + 1);
        if (retptr)
            strcpy(retptr, coinsCached); // for android shared object lib use the content received from Unity asset
    }
#else
    retptr = OS_loadfile(fname, &buf, &filesize, allocsizep);
#endif
    free(fname);
    return (retptr);
}

bits256 bits256_rev(bits256 hash)
{
    bits256 rev;
    int32_t i;
    for (i = 0; i < 32; i++)
        rev.bytes[i] = hash.bytes[31 - i];
    return (rev);
}

bits256 btc_uint256_to_bits256(uint256 hash256)
{
    bits256 hash;
    iguana_rwbignum(1, hash.bytes, sizeof(hash), (uint8_t*)hash256);
    return (hash);
}

void btc_bits256_to_uint256(bits256 hash, uint256 hash256)
{
    iguana_rwbignum(0, hash.bytes, sizeof(hash), (uint8_t*)hash256);
}

void btc_tx_add_txin(btc_tx* mtx, bits256 txid, int32_t vout)
{
    btc_tx_in* vin = btc_tx_in_new();
    btc_bits256_to_uint256(txid, vin->prevout.hash);
    vin->prevout.n = vout;
    vector_add(mtx->vin, vin);
}

void btc_tx_add_txout(btc_tx* mtx, uint64_t satoshis, cstring* scriptPubKey)
{
    btc_tx_out* vout = btc_tx_out_new();
    vout->script_pubkey = scriptPubKey;
    vout->value = satoshis;
    vector_add(mtx->vout, vout);
}

void btc_tx_add_p2pk(btc_tx* mtx, uint64_t satoshis, uint8_t* pubkey33)
{
    btc_tx_out* vout = btc_tx_out_new();
    vout->script_pubkey = cstr_new_sz(35);
    btc_script_append_pushdata(vout->script_pubkey, pubkey33, 33);
    btc_script_append_op(vout->script_pubkey, OP_CHECKSIG);
    vout->value = satoshis;
    vector_add(mtx->vout, vout);
}

btc_tx* NSPV_txextract(uint8_t* data, int32_t datalen)
{
    btc_tx* tx = btc_tx_new(SAPLING_TX_VERSION);
    if (btc_tx_deserialize(data, datalen, tx, 0, false) == 0) {
        fprintf(stderr, "NSPV_txextract btc_tx_deserialize error datalen.%d\n", datalen);
        btc_tx_free(tx);
        tx = 0;
    }
    return (tx);
}

btc_tx* btc_tx_decodehex(char* hexstr)
{
    uint8_t* data;
    btc_tx* tx;
    int32_t len = (int32_t)strlen(hexstr) >> 1;
    data = btc_malloc(len);
    decode_hex(data, len, hexstr);
    tx = NSPV_txextract(data, len);
    btc_free(data);
    return (tx);
}

char* btc_cstr_to_hex(char* hexstr, int32_t maxlen, cstring* cstr)
{
    int32_t i, len;
    hexstr[0] = 0;
    if (cstr != 0 && cstr->str != 0 && (len = cstr->len) <= (maxlen >> 1))
        utils_bin_to_hex((uint8_t*)cstr->str, len, hexstr);
    //fprintf(stderr,"clen.%d maxlen.%d cmp.%d\n",len,maxlen,(int32_t)cstr->len <= (maxlen>>1)-1);
    return (hexstr);
}

cstring* btc_tx_to_cstr(btc_tx* tx)
{
    int32_t hexlen;
    cstring *hex = 0, *txser = cstr_new_sz(1024);
    btc_tx_serialize(txser, tx, false);
    if ((hexlen = txser->len * 2) > 0) {
        hex = cstr_new_sz(hexlen + 1);
        hex->len = hexlen;
        btc_cstr_to_hex(hex->str, hex->len, txser);
        //fprintf(stderr,"tx[%d] to (%s) len.%d\n",(int32_t)txser->len,hex->str,(int32_t)hex->len);
    }
    cstr_free(txser, 1);
    return (hex);
}

bits256 NSPV_tx_hash(btc_tx* tx)
{
    uint256 hash;
    btc_tx_hash(tx, hash);
    return (btc_uint256_to_bits256(hash));
}

cJSON* btc_txvin_to_json(btc_tx_in* vin)
{
    char hexstr[NSPV_MAXSCRIPTSIZE * 2 + 1];
    cJSON* item = cJSON_CreateObject();
    jaddbits256(item, "txid", btc_uint256_to_bits256(vin->prevout.hash));
    jaddnum(item, "vout", vin->prevout.n);
    jaddstr(item, "scriptSig", btc_cstr_to_hex(hexstr, sizeof(hexstr), vin->script_sig));
    jaddnum(item, "sequenceid", vin->sequence);
    return (item);
}

cJSON* btc_txvins_to_json(vector* vin)
{
    int32_t i;
    cJSON* vins = cJSON_CreateArray();
    if (vin != 0) {
        for (i = 0; i < (int32_t)vin->len; i++)
            jaddi(vins, btc_txvin_to_json(vector_idx(vin, i)));
    }
    return (vins);
}

cJSON* btc_txvout_to_json(btc_tx_out* vout)
{
    char hexstr[NSPV_MAXSCRIPTSIZE * 2 + 1];
    cJSON* item = cJSON_CreateObject();
    jaddnum(item, "value", dstr(vout->value));
    jaddstr(item, "scriptPubKey", btc_cstr_to_hex(hexstr, sizeof(hexstr), vout->script_pubkey));
    return (item);
}

cJSON* btc_txvouts_to_json(vector* vout)
{
    int32_t i;
    cJSON* vouts = cJSON_CreateArray();
    if (vout != 0) {
        for (i = 0; i < (int32_t)vout->len; i++)
            jaddi(vouts, btc_txvout_to_json(vector_idx(vout, i)));
    }
    return (vouts);
}

cJSON* btc_tx_to_json(btc_tx* tx)
{
    cJSON* txjson = cJSON_CreateObject();
    jaddnum(txjson, "nVersion", tx->version & 0x7fffffff);
    jadd(txjson, "vin", btc_txvins_to_json(tx->vin));
    jadd(txjson, "vout", btc_txvouts_to_json(tx->vout));
    jaddnum(txjson, "nLockTime", tx->locktime);
    if (tx->version == SAPLING_TX_VERSION) {
        jaddnum(txjson, "nExpiryHeight", tx->nExpiryHeight);
        jaddnum(txjson, "valueBalance", tx->valueBalance);
    }
    return (txjson);
}

btc_tx_in* btc_tx_vin(btc_tx* tx, int32_t vini)
{
    if (tx != 0 && tx->vin != 0 && vini < (int32_t)tx->vin->len)
        return (vector_idx(tx->vin, vini));
    else
        return (0);
}

btc_tx_out* btc_tx_vout(btc_tx* tx, int32_t v)
{
    if (tx != 0 && tx->vout != 0 && v < (int32_t)tx->vout->len)
        return (vector_idx(tx->vout, v));
    else
        return (0);
}

uint64_t _komodo_interestnew(int32_t txheight, uint64_t nValue, uint32_t nLockTime, uint32_t tiptime)
{
    int32_t minutes;
    uint64_t interest = 0;
    if (nLockTime >= NSPV_LOCKTIME_THRESHOLD && tiptime > nLockTime && (minutes = (tiptime - nLockTime) / 60) >= (NSPV_KOMODO_MAXMEMPOOLTIME / 60)) {
        if (minutes > 365 * 24 * 60)
            minutes = 365 * 24 * 60;
        if (txheight >= 1000000 && minutes > 31 * 24 * 60)
            minutes = 31 * 24 * 60;
        minutes -= ((NSPV_KOMODO_MAXMEMPOOLTIME / 60) - 1);
        interest = ((nValue / 10512000) * minutes);
    }
    return (interest);
}

uint64_t komodo_interestnew(int32_t txheight, uint64_t nValue, uint32_t nLockTime, uint32_t tiptime)
{
    uint64_t interest = 0;
    if (txheight < NSPV_KOMODO_ENDOFERA && nLockTime >= NSPV_LOCKTIME_THRESHOLD && tiptime != 0 && nLockTime < tiptime && nValue >= 10 * COIN)
        interest = _komodo_interestnew(txheight, nValue, nLockTime, tiptime);
    return (interest);
}

#define NUM_KMD_SEASONS 3
#define NUM_KMD_NOTARIES 64
static const uint32_t KMD_SEASON_TIMESTAMPS[NUM_KMD_SEASONS] = {1525132800, 1563148800, 1751328000};
static const int32_t KMD_SEASON_HEIGHTS[NUM_KMD_SEASONS] = {814000, 1444000, 7113400};

// Era array of pubkeys. Add extra seasons to bottom as requried, after adding appropriate info above.
static const char* notaries_elected[NUM_KMD_SEASONS][NUM_KMD_NOTARIES][2] =
    {
        {{"0_jl777_testA", "03b7621b44118017a16043f19b30cc8a4cfe068ac4e42417bae16ba460c80f3828"},
         {"0_jl777_testB", "02ebfc784a4ba768aad88d44d1045d240d47b26e248cafaf1c5169a42d7a61d344"},
         {"0_kolo_testA", "0287aa4b73988ba26cf6565d815786caf0d2c4af704d7883d163ee89cd9977edec"},
         {"artik_AR", "029acf1dcd9f5ff9c455f8bb717d4ae0c703e089d16cf8424619c491dff5994c90"},
         {"artik_EU", "03f54b2c24f82632e3cdebe4568ba0acf487a80f8a89779173cdb78f74514847ce"},
         {"artik_NA", "0224e31f93eff0cc30eaf0b2389fbc591085c0e122c4d11862c1729d090106c842"},
         {"artik_SH", "02bdd8840a34486f38305f311c0e2ae73e84046f6e9c3dd3571e32e58339d20937"},
         {"badass_EU", "0209d48554768dd8dada988b98aca23405057ac4b5b46838a9378b95c3e79b9b9e"},
         {"badass_NA", "02afa1a9f948e1634a29dc718d218e9d150c531cfa852843a1643a02184a63c1a7"},
         {"badass_SH", "026b49dd3923b78a592c1b475f208e23698d3f085c4c3b4906a59faf659fd9530b"},
         {"crackers_EU", "03bc819982d3c6feb801ec3b720425b017d9b6ee9a40746b84422cbbf929dc73c3"}, // 10
         {"crackers_NA", "03205049103113d48c7c7af811b4c8f194dafc43a50d5313e61a22900fc1805b45"},
         {"crackers_SH", "02be28310e6312d1dd44651fd96f6a44ccc269a321f907502aae81d246fabdb03e"},
         {"durerus_EU", "02bcbd287670bdca2c31e5d50130adb5dea1b53198f18abeec7211825f47485d57"},
         {"etszombi_AR", "031c79168d15edabf17d9ec99531ea9baa20039d0cdc14d9525863b83341b210e9"},
         {"etszombi_EU", "0281b1ad28d238a2b217e0af123ce020b79e91b9b10ad65a7917216eda6fe64bf7"}, // 15
         {"etszombi_SH", "025d7a193c0757f7437fad3431f027e7b5ed6c925b77daba52a8755d24bf682dde"},
         {"farl4web_EU", "0300ecf9121cccf14cf9423e2adb5d98ce0c4e251721fa345dec2e03abeffbab3f"},
         {"farl4web_SH", "0396bb5ed3c57aa1221d7775ae0ff751e4c7dc9be220d0917fa8bbdf670586c030"},
         {"fullmoon_AR", "0254b1d64840ce9ff6bec9dd10e33beb92af5f7cee628f999cb6bc0fea833347cc"},
         {"fullmoon_NA", "031fb362323b06e165231c887836a8faadb96eda88a79ca434e28b3520b47d235b"}, // 20
         {"fullmoon_SH", "030e12b42ec33a80e12e570b6c8274ce664565b5c3da106859e96a7208b93afd0d"},
         {"grewal_NA", "03adc0834c203d172bce814df7c7a5e13dc603105e6b0adabc942d0421aefd2132"},
         {"grewal_SH", "03212a73f5d38a675ee3cdc6e82542a96c38c3d1c79d25a1ed2e42fcf6a8be4e68"},
         {"indenodes_AR", "02ec0fa5a40f47fd4a38ea5c89e375ad0b6ddf4807c99733c9c3dc15fb978ee147"},
         {"indenodes_EU", "0221387ff95c44cb52b86552e3ec118a3c311ca65b75bf807c6c07eaeb1be8303c"},
         {"indenodes_NA", "02698c6f1c9e43b66e82dbb163e8df0e5a2f62f3a7a882ca387d82f86e0b3fa988"},
         {"indenodes_SH", "0334e6e1ec8285c4b85bd6dae67e17d67d1f20e7328efad17ce6fd24ae97cdd65e"},
         {"jeezy_EU", "023cb3e593fb85c5659688528e9a4f1c4c7f19206edc7e517d20f794ba686fd6d6"},
         {"jsgalt_NA", "027b3fb6fede798cd17c30dbfb7baf9332b3f8b1c7c513f443070874c410232446"},
         {"karasugoi_NA", "02a348b03b9c1a8eac1b56f85c402b041c9bce918833f2ea16d13452309052a982"}, // 30
         {"kashifali_EU", "033777c52a0190f261c6f66bd0e2bb299d30f012dcb8bfff384103211edb8bb207"},
         {"kolo_AR", "03016d19344c45341e023b72f9fb6e6152fdcfe105f3b4f50b82a4790ff54e9dc6"},
         {"kolo_SH", "02aa24064500756d9b0959b44d5325f2391d8e95c6127e109184937152c384e185"},
         {"metaphilibert_AR", "02adad675fae12b25fdd0f57250b0caf7f795c43f346153a31fe3e72e7db1d6ac6"},
         {"movecrypto_AR", "022783d94518e4dc77cbdf1a97915b29f427d7bc15ea867900a76665d3112be6f3"},
         {"movecrypto_EU", "021ab53bc6cf2c46b8a5456759f9d608966eff87384c2b52c0ac4cc8dd51e9cc42"},
         {"movecrypto_NA", "02efb12f4d78f44b0542d1c60146738e4d5506d27ec98a469142c5c84b29de0a80"},
         {"movecrypto_SH", "031f9739a3ebd6037a967ce1582cde66e79ea9a0551c54731c59c6b80f635bc859"},
         {"muros_AR", "022d77402fd7179335da39479c829be73428b0ef33fb360a4de6890f37c2aa005e"},
         {"noashh_AR", "029d93ef78197dc93892d2a30e5a54865f41e0ca3ab7eb8e3dcbc59c8756b6e355"}, // 40
         {"noashh_EU", "02061c6278b91fd4ac5cab4401100ffa3b2d5a277e8f71db23401cc071b3665546"},
         {"noashh_NA", "033c073366152b6b01535e15dd966a3a8039169584d06e27d92a69889b720d44e1"},
         {"nxtswe_EU", "032fb104e5eaa704a38a52c126af8f67e870d70f82977e5b2f093d5c1c21ae5899"},
         {"polycryptoblog_NA", "02708dcda7c45fb54b78469673c2587bfdd126e381654819c4c23df0e00b679622"},
         {"pondsea_AR", "032e1c213787312099158f2d74a89e8240a991d162d4ce8017d8504d1d7004f735"},
         {"pondsea_EU", "0225aa6f6f19e543180b31153d9e6d55d41bc7ec2ba191fd29f19a2f973544e29d"},
         {"pondsea_NA", "031bcfdbb62268e2ff8dfffeb9ddff7fe95fca46778c77eebff9c3829dfa1bb411"},
         {"pondsea_SH", "02209073bc0943451498de57f802650311b1f12aa6deffcd893da198a544c04f36"},
         {"popcornbag_AR", "02761f106fb34fbfc5ddcc0c0aa831ed98e462a908550b280a1f7bd32c060c6fa3"},
         {"popcornbag_NA", "03c6085c7fdfff70988fda9b197371f1caf8397f1729a844790e421ee07b3a93e8"}, // 50
         {"ptytrader_NA", "0328c61467148b207400b23875234f8a825cce65b9c4c9b664f47410b8b8e3c222"},
         {"ptytrader_SH", "0250c93c492d8d5a6b565b90c22bee07c2d8701d6118c6267e99a4efd3c7748fa4"},
         {"rnr_AR", "029bdb08f931c0e98c2c4ba4ef45c8e33a34168cb2e6bf953cef335c359d77bfcd"},
         {"rnr_EU", "03f5c08dadffa0ffcafb8dd7ffc38c22887bd02702a6c9ac3440deddcf2837692b"},
         {"rnr_NA", "02e17c5f8c3c80f584ed343b8dcfa6d710dfef0889ec1e7728ce45ce559347c58c"},
         {"rnr_SH", "037536fb9bdfed10251f71543fb42679e7c52308bcd12146b2568b9a818d8b8377"},
         {"titomane_AR", "03cda6ca5c2d02db201488a54a548dbfc10533bdc275d5ea11928e8d6ab33c2185"},
         {"titomane_EU", "02e41feded94f0cc59f55f82f3c2c005d41da024e9a805b41105207ef89aa4bfbd"},
         {"titomane_SH", "035f49d7a308dd9a209e894321f010d21b7793461b0c89d6d9231a3fe5f68d9960"},
         {"vanbreuk_EU", "024f3cad7601d2399c131fd070e797d9cd8533868685ddbe515daa53c2e26004c3"}, // 60
         {"xrobesx_NA", "03f0cc6d142d14a40937f12dbd99dbd9021328f45759e26f1877f2a838876709e1"},
         {"xxspot1_XX", "02ef445a392fcaf3ad4176a5da7f43580e8056594e003eba6559a713711a27f955"},
         {"xxspot2_XX", "03d85b221ea72ebcd25373e7961f4983d12add66a92f899deaf07bab1d8b6f5573"}},
        {
            {"0dev1_jl777", "03b7621b44118017a16043f19b30cc8a4cfe068ac4e42417bae16ba460c80f3828"},
            {"0dev2_kolo", "030f34af4b908fb8eb2099accb56b8d157d49f6cfb691baa80fdd34f385efed961"},
            {"0dev3_kolo", "025af9d2b2a05338478159e9ac84543968fd18c45fd9307866b56f33898653b014"},
            {"0dev4_decker", "028eea44a09674dda00d88ffd199a09c9b75ba9782382cc8f1e97c0fd565fe5707"},
            {"a-team_SH", "03b59ad322b17cb94080dc8e6dc10a0a865de6d47c16fb5b1a0b5f77f9507f3cce"},
            {"artik_AR", "029acf1dcd9f5ff9c455f8bb717d4ae0c703e089d16cf8424619c491dff5994c90"},
            {"artik_EU", "03f54b2c24f82632e3cdebe4568ba0acf487a80f8a89779173cdb78f74514847ce"},
            {"artik_NA", "0224e31f93eff0cc30eaf0b2389fbc591085c0e122c4d11862c1729d090106c842"},
            {"artik_SH", "02bdd8840a34486f38305f311c0e2ae73e84046f6e9c3dd3571e32e58339d20937"},
            {"badass_EU", "0209d48554768dd8dada988b98aca23405057ac4b5b46838a9378b95c3e79b9b9e"},
            {"badass_NA", "02afa1a9f948e1634a29dc718d218e9d150c531cfa852843a1643a02184a63c1a7"}, // 10
            {"batman_AR", "033ecb640ec5852f42be24c3bf33ca123fb32ced134bed6aa2ba249cf31b0f2563"},
            {"batman_SH", "02ca5898931181d0b8aafc75ef56fce9c43656c0b6c9f64306e7c8542f6207018c"},
            {"ca333_EU", "03fc87b8c804f12a6bd18efd43b0ba2828e4e38834f6b44c0bfee19f966a12ba99"},
            {"chainmakers_EU", "02f3b08938a7f8d2609d567aebc4989eeded6e2e880c058fdf092c5da82c3bc5ee"},
            {"chainmakers_NA", "0276c6d1c65abc64c8559710b8aff4b9e33787072d3dda4ec9a47b30da0725f57a"},
            {"chainstrike_SH", "0370bcf10575d8fb0291afad7bf3a76929734f888228bc49e35c5c49b336002153"},
            {"cipi_AR", "02c4f89a5b382750836cb787880d30e23502265054e1c327a5bfce67116d757ce8"},
            {"cipi_NA", "02858904a2a1a0b44df4c937b65ee1f5b66186ab87a751858cf270dee1d5031f18"},
            {"crackers_EU", "03bc819982d3c6feb801ec3b720425b017d9b6ee9a40746b84422cbbf929dc73c3"},
            {"crackers_NA", "03205049103113d48c7c7af811b4c8f194dafc43a50d5313e61a22900fc1805b45"}, // 20
            {"dwy_EU", "0259c646288580221fdf0e92dbeecaee214504fdc8bbdf4a3019d6ec18b7540424"},
            {"emmanux_SH", "033f316114d950497fc1d9348f03770cd420f14f662ab2db6172df44c389a2667a"},
            {"etszombi_EU", "0281b1ad28d238a2b217e0af123ce020b79e91b9b10ad65a7917216eda6fe64bf7"},
            {"fullmoon_AR", "03380314c4f42fa854df8c471618751879f9e8f0ff5dbabda2bd77d0f96cb35676"},
            {"fullmoon_NA", "030216211d8e2a48bae9e5d7eb3a42ca2b7aae8770979a791f883869aea2fa6eef"},
            {"fullmoon_SH", "03f34282fa57ecc7aba8afaf66c30099b5601e98dcbfd0d8a58c86c20d8b692c64"},
            {"goldenman_EU", "02d6f13a8f745921cdb811e32237bb98950af1a5952be7b3d429abd9152f8e388d"},
            {"indenodes_AR", "02ec0fa5a40f47fd4a38ea5c89e375ad0b6ddf4807c99733c9c3dc15fb978ee147"},
            {"indenodes_EU", "0221387ff95c44cb52b86552e3ec118a3c311ca65b75bf807c6c07eaeb1be8303c"},
            {"indenodes_NA", "02698c6f1c9e43b66e82dbb163e8df0e5a2f62f3a7a882ca387d82f86e0b3fa988"}, // 30
            {"indenodes_SH", "0334e6e1ec8285c4b85bd6dae67e17d67d1f20e7328efad17ce6fd24ae97cdd65e"},
            {"jackson_AR", "038ff7cfe34cb13b524e0941d5cf710beca2ffb7e05ddf15ced7d4f14fbb0a6f69"},
            {"jeezy_EU", "023cb3e593fb85c5659688528e9a4f1c4c7f19206edc7e517d20f794ba686fd6d6"},
            {"karasugoi_NA", "02a348b03b9c1a8eac1b56f85c402b041c9bce918833f2ea16d13452309052a982"},
            {"komodoninja_EU", "038e567b99806b200b267b27bbca2abf6a3e8576406df5f872e3b38d30843cd5ba"},
            {"komodoninja_SH", "033178586896915e8456ebf407b1915351a617f46984001790f0cce3d6f3ada5c2"},
            {"komodopioneers_SH", "033ace50aedf8df70035b962a805431363a61cc4e69d99d90726a2d48fb195f68c"},
            {"libscott_SH", "03301a8248d41bc5dc926088a8cf31b65e2daf49eed7eb26af4fb03aae19682b95"},
            {"lukechilds_AR", "031aa66313ee024bbee8c17915cf7d105656d0ace5b4a43a3ab5eae1e14ec02696"},
            {"madmax_AR", "03891555b4a4393d655bf76f0ad0fb74e5159a615b6925907678edc2aac5e06a75"}, // 40
            {"meshbits_AR", "02957fd48ae6cb361b8a28cdb1b8ccf5067ff68eb1f90cba7df5f7934ed8eb4b2c"},
            {"meshbits_SH", "025c6e94877515dfd7b05682b9cc2fe4a49e076efe291e54fcec3add78183c1edb"},
            {"metaphilibert_AR", "02adad675fae12b25fdd0f57250b0caf7f795c43f346153a31fe3e72e7db1d6ac6"},
            {"metaphilibert_SH", "0284af1a5ef01503e6316a2ca4abf8423a794e9fc17ac6846f042b6f4adedc3309"},
            {"patchkez_SH", "0296270f394140640f8fa15684fc11255371abb6b9f253416ea2734e34607799c4"},
            {"pbca26_NA", "0276aca53a058556c485bbb60bdc54b600efe402a8b97f0341a7c04803ce204cb5"},
            {"peer2cloud_AR", "034e5563cb885999ae1530bd66fab728e580016629e8377579493b386bf6cebb15"},
            {"peer2cloud_SH", "03396ac453b3f23e20f30d4793c5b8ab6ded6993242df4f09fd91eb9a4f8aede84"},
            {"polycryptoblog_NA", "02708dcda7c45fb54b78469673c2587bfdd126e381654819c4c23df0e00b679622"},
            {"hyper_AR", "020f2f984d522051bd5247b61b080b4374a7ab389d959408313e8062acad3266b4"}, // 50
            {"hyper_EU", "03d00cf9ceace209c59fb013e112a786ad583d7de5ca45b1e0df3b4023bb14bf51"},
            {"hyper_SH", "0383d0b37f59f4ee5e3e98a47e461c861d49d0d90c80e9e16f7e63686a2dc071f3"},
            {"hyper_NA", "03d91c43230336c0d4b769c9c940145a8c53168bf62e34d1bccd7f6cfc7e5592de"},
            {"popcornbag_AR", "02761f106fb34fbfc5ddcc0c0aa831ed98e462a908550b280a1f7bd32c060c6fa3"},
            {"popcornbag_NA", "03c6085c7fdfff70988fda9b197371f1caf8397f1729a844790e421ee07b3a93e8"},
            {"alien_AR", "0348d9b1fc6acf81290405580f525ee49b4749ed4637b51a28b18caa26543b20f0"},
            {"alien_EU", "020aab8308d4df375a846a9e3b1c7e99597b90497efa021d50bcf1bbba23246527"},
            {"thegaltmines_NA", "031bea28bec98b6380958a493a703ddc3353d7b05eb452109a773eefd15a32e421"},
            {"titomane_AR", "029d19215440d8cb9cc6c6b7a4744ae7fb9fb18d986e371b06aeb34b64845f9325"},
            {"titomane_EU", "0360b4805d885ff596f94312eed3e4e17cb56aa8077c6dd78d905f8de89da9499f"}, // 60
            {"titomane_SH", "03573713c5b20c1e682a2e8c0f8437625b3530f278e705af9b6614de29277a435b"},
            {"webworker01_NA", "03bb7d005e052779b1586f071834c5facbb83470094cff5112f0072b64989f97d7"},
            {"xrobesx_NA", "03f0cc6d142d14a40937f12dbd99dbd9021328f45759e26f1877f2a838876709e1"},
        },
        {
            {"madmax_NA", "0237e0d3268cebfa235958808db1efc20cc43b31100813b1f3e15cc5aa647ad2c3"}, // 0
            {"alright_AR", "020566fe2fb3874258b2d3cf1809a5d650e0edc7ba746fa5eec72750c5188c9cc9"},
            {"strob_NA", "0206f7a2e972d9dfef1c424c731503a0a27de1ba7a15a91a362dc7ec0d0fb47685"},
            {"dwy_EU", "021c7cf1f10c4dc39d13451123707ab780a741feedab6ac449766affe37515a29e"},
            {"phm87_SH", "021773a38db1bc3ede7f28142f901a161c7b7737875edbb40082a201c55dcf0add"},
            {"chainmakers_NA", "02285d813c30c0bf7eefdab1ff0a8ad08a07a0d26d8b95b3943ce814ac8e24d885"},
            {"indenodes_EU", "0221387ff95c44cb52b86552e3ec118a3c311ca65b75bf807c6c07eaeb1be8303c"},
            {"blackjok3r_SH", "021eac26dbad256cbb6f74d41b10763183ee07fb609dbd03480dd50634170547cc"},
            {"chainmakers_EU", "03fdf5a3fce8db7dee89724e706059c32e5aa3f233a6b6cc256fea337f05e3dbf7"},
            {"titomane_AR", "023e3aa9834c46971ff3e7cb86a200ec9c8074a9566a3ea85d400d5739662ee989"},
            {"fullmoon_SH", "023b7252968ea8a955cd63b9e57dee45a74f2d7ba23b4e0595572138ad1fb42d21"}, // 10
            {"indenodes_NA", "02698c6f1c9e43b66e82dbb163e8df0e5a2f62f3a7a882ca387d82f86e0b3fa988"},
            {"chmex_EU", "0281304ebbcc39e4f09fda85f4232dd8dacd668e20e5fc11fba6b985186c90086e"},
            {"metaphilibert_SH", "0284af1a5ef01503e6316a2ca4abf8423a794e9fc17ac6846f042b6f4adedc3309"},
            {"ca333_DEV", "02856843af2d9457b5b1c907068bef6077ea0904cc8bd4df1ced013f64bf267958"},
            {"cipi_NA", "02858904a2a1a0b44df4c937b65ee1f5b66186ab87a751858cf270dee1d5031f18"},
            {"pungocloud_SH", "024dfc76fa1f19b892be9d06e985d0c411e60dbbeb36bd100af9892a39555018f6"},
            {"voskcoin_EU", "034190b1c062a04124ad15b0fa56dfdf34aa06c164c7163b6aec0d654e5f118afb"},
            {"decker_DEV", "028eea44a09674dda00d88ffd199a09c9b75ba9782382cc8f1e97c0fd565fe5707"},
            {"cryptoeconomy_EU", "0290ab4937e85246e048552df3e9a66cba2c1602db76e03763e16c671e750145d1"},
            {"etszombi_EU", "0293ea48d8841af7a419a24d9da11c34b39127ef041f847651bae6ab14dcd1f6b4"}, // 20
            {"karasugoi_NA", "02a348b03b9c1a8eac1b56f85c402b041c9bce918833f2ea16d13452309052a982"},
            {"pirate_AR", "03e29c90354815a750db8ea9cb3c1b9550911bb205f83d0355a061ac47c4cf2fde"},
            {"metaphilibert_AR", "02adad675fae12b25fdd0f57250b0caf7f795c43f346153a31fe3e72e7db1d6ac6"},
            {"zatjum_SH", "02d6b0c89cacd58a0af038139a9a90c9e02cd1e33803a1f15fceabea1f7e9c263a"},
            {"madmax_AR", "03c5941fe49d673c094bc8e9bb1a95766b4670c88be76d576e915daf2c30a454d3"},
            {"lukechilds_NA", "03f1051e62c2d280212481c62fe52aab0a5b23c95de5b8e9ad5f80d8af4277a64b"},
            {"cipi_AR", "02c4f89a5b382750836cb787880d30e23502265054e1c327a5bfce67116d757ce8"},
            {"tonyl_AR", "02cc8bc862f2b65ad4f99d5f68d3011c138bf517acdc8d4261166b0be8f64189e1"},
            {"infotech_DEV", "0345ad4ab5254782479f6322c369cec77a7535d2f2162d103d666917d5e4f30c4c"},
            {"fullmoon_NA", "032c716701fe3a6a3f90a97b9d874a9d6eedb066419209eed7060b0cc6b710c60b"}, // 30
            {"etszombi_AR", "02e55e104aa94f70cde68165d7df3e162d4410c76afd4643b161dea044aa6d06ce"},
            {"node-9_EU", "0372e5b51e86e2392bb15039bac0c8f975b852b45028a5e43b324c294e9f12e411"},
            {"phba2061_EU", "03f6bd15dba7e986f0c976ea19d8a9093cb7c989d499f1708a0386c5c5659e6c4e"},
            {"indenodes_AR", "02ec0fa5a40f47fd4a38ea5c89e375ad0b6ddf4807c99733c9c3dc15fb978ee147"},
            {"and1-89_EU", "02736cbf8d7b50835afd50a319f162dd4beffe65f2b1dc6b90e64b32c8e7849ddd"},
            {"komodopioneers_SH", "032a238a5747777da7e819cfa3c859f3677a2daf14e4dce50916fc65d00ad9c52a"},
            {"komodopioneers_EU", "036d02425916444fff8cc7203fcbfc155c956dda5ceb647505836bef59885b6866"},
            {"d0ct0r_NA", "0303725d8525b6f969122faf04152653eb4bf34e10de92182263321769c334bf58"},
            {"kolo_DEV", "02849e12199dcc27ba09c3902686d2ad0adcbfcee9d67520e9abbdda045ba83227"},
            {"peer2cloud_AR", "02acc001fe1fe8fd68685ba26c0bc245924cb592e10cec71e9917df98b0e9d7c37"}, // 40
            {"webworker01_SH", "031e50ba6de3c16f99d414bb89866e578d963a54bde7916c810608966fb5700776"},
            {"webworker01_NA", "032735e9cad1bb00eaababfa6d27864fa4c1db0300c85e01e52176be2ca6a243ce"},
            {"pbca26_NA", "03a97606153d52338bcffd1bf19bb69ef8ce5a7cbdc2dbc3ff4f89d91ea6bbb4dc"},
            {"indenodes_SH", "0334e6e1ec8285c4b85bd6dae67e17d67d1f20e7328efad17ce6fd24ae97cdd65e"},
            {"pirate_NA", "0255e32d8a56671dee8aa7f717debb00efa7f0086ee802de0692f2d67ee3ee06ee"},
            {"lukechilds_AR", "025c6a73ff6d750b9ddf6755b390948cffdd00f344a639472d398dd5c6b4735d23"},
            {"dragonhound_NA", "0224a9d951d3a06d8e941cc7362b788bb1237bb0d56cc313e797eb027f37c2d375"},
            {"fullmoon_AR", "03da64dd7cd0db4c123c2f79d548a96095a5a103e5b9d956e9832865818ffa7872"},
            {"chainzilla_SH", "0360804b8817fd25ded6e9c0b50e3b0782ac666545b5416644198e18bc3903d9f9"},
            {"titomane_EU", "03772ac0aad6b0e9feec5e591bff5de6775d6132e888633e73d3ba896bdd8e0afb"}, // 50
            {"jeezy_EU", "037f182facbad35684a6e960699f5da4ba89e99f0d0d62a87e8400dd086c8e5dd7"},
            {"titomane_SH", "03850fdddf2413b51790daf51dd30823addb37313c8854b508ea6228205047ef9b"},
            {"alien_AR", "03911a60395801082194b6834244fa78a3c30ff3e888667498e157b4aa80b0a65f"},
            {"pirate_EU", "03fff24efd5648870a23badf46e26510e96d9e79ce281b27cfe963993039dd1351"},
            {"thegaltmines_NA", "02db1a16c7043f45d6033ccfbd0a51c2d789b32db428902f98b9e155cf0d7910ed"},
            {"computergenie_NA", "03a78ae070a5e9e935112cf7ea8293f18950f1011694ea0260799e8762c8a6f0a4"},
            {"nutellalicka_SH", "02f7d90d0510c598ce45915e6372a9cd0ba72664cb65ce231f25d526fc3c5479fc"},
            {"chainstrike_SH", "03b806be3bf7a1f2f6290ec5c1ea7d3ea57774dcfcf2129a82b2569e585100e1cb"},
            {"dwy_SH", "036536d2d52d85f630b68b050f29ea1d7f90f3b42c10f8c5cdf3dbe1359af80aff"},
            {"alien_EU", "03bb749e337b9074465fa28e757b5aa92cb1f0fea1a39589bca91a602834d443cd"}, // 60
            {"gt_AR", "0348430538a4944d3162bb4749d8c5ed51299c2434f3ee69c11a1f7815b3f46135"},
            {"patchkez_SH", "03f45e9beb5c4cd46525db8195eb05c1db84ae7ef3603566b3d775770eba3b96ee"},
            {"decker_AR", "03ffdf1a116300a78729608d9930742cd349f11a9d64fcc336b8f18592dd9c91bc"}, // 63
        }};

int32_t getkmdseason(int32_t height)
{
    if (height <= KMD_SEASON_HEIGHTS[0])
        return (1);
    for (int32_t i = 1; i < NUM_KMD_SEASONS; i++) {
        if (height <= KMD_SEASON_HEIGHTS[i] && height >= KMD_SEASON_HEIGHTS[i - 1])
            return (i + 1);
    }
    return (0);
}

int32_t getacseason(uint32_t timestamp)
{
    if (timestamp <= KMD_SEASON_TIMESTAMPS[0])
        return (1);
    for (int32_t i = 1; i < NUM_KMD_SEASONS; i++) {
        if (timestamp <= KMD_SEASON_TIMESTAMPS[i] && timestamp >= KMD_SEASON_TIMESTAMPS[i - 1])
            return (i + 1);
    }
    return (0);
}

int32_t komodo_notaries(btc_spv_client* client, uint8_t pubkeys[64][33], int32_t height, uint32_t timestamp)
{
    static uint8_t kmd_pubkeys[NUM_KMD_SEASONS][64][33], didinit[NUM_KMD_SEASONS];
    int32_t i, isKMD, n, kmd_season = 0;
    uint64_t mask = 0;
    isKMD = (strcmp(client->chainparams->name, "KMD") == 0);
    if (isKMD != 0) {
        if (height >= 180000)
            kmd_season = getkmdseason(height);
    } else {
        kmd_season = getacseason(timestamp);
    }
    //fprintf(stderr, "kmd season %i\n", kmd_season);
    if (kmd_season != 0) {
        if (didinit[kmd_season - 1] == 0) {
            for (i = 0; i < NUM_KMD_NOTARIES; i++)
                decode_hex(kmd_pubkeys[kmd_season - 1][i], 33, (char*)notaries_elected[kmd_season - 1][i][1]);
            didinit[kmd_season - 1] = 1;
        }
        memcpy(pubkeys, kmd_pubkeys[kmd_season - 1], NUM_KMD_NOTARIES * 33);
        return (NUM_KMD_NOTARIES);
    }
    return (-1);
}

bits256 NSPV_opretextract(int32_t* heightp, bits256* blockhashp, char* opret)
{
    bits256 desttxid;
    int32_t i, offset;
    char str[65];
    offset = strcmp(NSPV_client->chainparams->name, "KMD") == 0 ? 2 : 3;
    if (opret != 0) {
        //for (i=0; i<opret->len; i++)
        //    fprintf(stderr,"%02x",opret->str[i]&0xff);
        iguana_rwnum(0, (uint8_t*)&opret[offset + 32], sizeof(*heightp), heightp);
        for (i = 0; i < 32; i++)
            ((uint8_t*)blockhashp)[31 - i] = opret[offset + i];
        for (i = 0; i < 32; i++)
            ((uint8_t*)&desttxid)[31 - i] = opret[offset + 4 + 32 + i];

        fprintf(stderr, " ntzht.%i %s <- size.%d\n", *heightp, bits256_str(str, (*blockhashp)), (int32_t)(strlen(opret) * 2));
        return (desttxid);
    } else
        return (zeroid);
}

int32_t bitweight(uint64_t x)
{
    int i, wt = 0;
    for (i = 0; i < 64; i++)
        if ((1LL << i) & x)
            wt++;
    return (wt);
}

int32_t NSPV_fastnotariescount(btc_tx* tx, uint8_t elected[64][33])
{
    int32_t vini, j;
    btc_pubkey pubkeys[64];
    uint64_t mask = 0;
    btc_tx_in* vin;
    bits256 sighash;
    uint256 hash;
    uint8_t script[35];
    char str[65];
    if (tx == 0 || tx->vin == 0)
        return (-1);
    memset(pubkeys, 0, sizeof(pubkeys));
    for (j = 0; j < 64; j++) {
        memcpy(pubkeys[j].pubkey, elected[j], 33);
        pubkeys[j].compressed = true;
    }
    script[0] = 33;
    script[34] = OP_CHECKSIG;
    for (vini = 0; vini < (int32_t)tx->vin->len; vini++) {
        if ((vin = btc_tx_vin(tx, vini)) == 0)
            return (-vini - 2);
        //for (j=0; j<vin->script_sig->len; j++)
        //    fprintf(stderr,"%02x",vin->script_sig->str[j]&0xff);
        //fprintf(stderr," sig.%d\n",vini);
        for (j = 0; j < 64; j++) {
            if (((1LL << j) & mask) != 0)
                continue;
            memcpy(script + 1, elected[j], 33);
            sighash = NSPV_sapling_sighash(tx, vini, 10000, script, 35);
            //fprintf(stderr,"%s ",bits256_str(str,sighash));
            btc_bits256_to_uint256(sighash, hash);
            if (btc_pubkey_verify_sig(&pubkeys[j], hash, (uint8_t*)vin->script_sig->str + 1, vin->script_sig->len - 2) > 0) {
                mask |= (1LL << j);
                //fprintf(stderr,"validated.%llx ",(long long)mask);
                break;
            }
        }
        //fprintf(stderr,"vini.%d numsigs.%d\n",vini,bitweight(mask));
    }
    return (bitweight(mask));
}

int32_t NSPV_notarizationextract(btc_spv_client* client, int32_t verifyntz, int32_t* ntzheightp, bits256* blockhashp, bits256* desttxidp, btc_tx* tx, uint32_t timestamp)
{
    int32_t numsigs = 0;
    btc_tx_out* vout;
    uint8_t elected[64][33];
    if (tx->vout != 0 && tx->vout->len >= 2 && (vout = btc_tx_vout(tx, 1)) != 0) {
        if (vout->script_pubkey != 0 && vout->script_pubkey->len >= 2 + 32 * 2 + 4 && vout->script_pubkey->str[0] == OP_RETURN) {
            *desttxidp = NSPV_opretextract(ntzheightp, blockhashp, vout->script_pubkey->str);
            if (komodo_notaries(client, elected, *ntzheightp, timestamp) <= 0)
                fprintf(stderr, "non-support notary list\n");
            if (verifyntz != 0 && (numsigs = NSPV_fastnotariescount(tx, elected)) < 12) {
                fprintf(stderr, "need to implement fastnotaries count, numsigs.%d error\n", numsigs);
                return (-3);
            }
            return (0);
        } else {
            fprintf(stderr, "opretsize.%d error\n", (int32_t)vout->script_pubkey->len);
            return (-2);
        }
    } else
        return (-1);
}

#ifdef LATER

/*
 NSPV_notariescount is the slowest process during full validation as it requires looking up 13 transactions.
 one way that would be 10000x faster would be to bruteforce validate the signatures in each vin, against all 64 pubkeys! for a valid tx, that is on average 13*32 secp256k1/sapling verify operations, which is much faster than even a single network request.
 Unfortunately, due to the complexity of calculating the hash to sign for a tx, this bruteforcing would require determining what type of signature method and having sapling vs legacy methods of calculating the txhash.
 It could be that the fullnode side could calculate this and send it back to the superlite side as any hash that would validate 13 different ways has to be the valid txhash.
 However, since the vouts being spent by the notaries are highly constrained p2pk vouts, the txhash can be deduced if a specific notary pubkey is indeed the signer
 */
int32_t NSPV_notariescount(CTransaction tx, uint8_t elected[64][33])
{
    uint8_t* script;
    CTransaction vintx;
    int64_t rewardsum = 0;
    int32_t i, j, utxovout, scriptlen, numsigs = 0;
    for (i = 0; i < tx.vin.size(); i++) {
        utxovout = tx.vin[i].prevout.n;
        if (NSPV_gettransaction(1, utxovout, tx.vin[i].prevout.hash, 0, vintx, -1, 0, rewardsum) != 0) {
            fprintf(stderr, "error getting %s/v%d\n", tx.vin[i].prevout.hash.GetHex().c_str(), utxovout);
            return (numsigs);
        }
        if (utxovout < vintx.vout.size()) {
            script = (uint8_t*)&vintx.vout[utxovout].scriptPubKey[0];
            if ((scriptlen = vintx.vout[utxovout].scriptPubKey.size()) == 35) {
                for (j = 0; j < 64; j++)
                    if (memcmp(&script[1], elected[j], 33) == 0) {
                        numsigs++;
                        break;
                    }
            } else
                fprintf(stderr, "invalid scriptlen.%d\n", scriptlen);
        } else
            fprintf(stderr, "invalid utxovout.%d vs %d\n", utxovout, (int32_t)vintx.vout.size());
    }
    return (numsigs);
}

#endif


int32_t NSPV_encrypt(uint16_t ind, uint8_t encoded[NSPV_ENCRYPTED_MAXSIZE], uint8_t* msg, int32_t msglen, bits256 privkey)
{
    bits256 pubkey;
    int32_t len = 2;
    uint8_t space[NSPV_ENCRYPTED_MAXSIZE], *nonce, *cipher;
    pubkey = acct777_pubkey(privkey);
    encoded[len++] = ind & 0xff;
    encoded[len++] = (ind >> 8) & 0xff;
    nonce = &encoded[len];
    btc_random_bytes(nonce, crypto_box_NONCEBYTES, 0);
    //OS_randombytes(nonce,crypto_box_NONCEBYTES);
    cipher = &encoded[len + crypto_box_NONCEBYTES];
    msglen = _SuperNET_cipher(nonce, &encoded[len + crypto_box_NONCEBYTES], msg, msglen, pubkey, privkey, space);
    msglen += crypto_box_NONCEBYTES;
    msg = encoded;
    msglen += len;
    encoded[0] = msglen & 0xff;
    encoded[1] = (msglen >> 8) & 0xff;
    //int32_t i; for (i=0; i<msglen; i++)
    //    fprintf(stderr,"%02x",encoded[i]);
    //fprintf(stderr," encoded.%d\n",msglen);
    return (msglen);
}

uint8_t* NSPV_decrypt(uint16_t* indp, int32_t* recvlenp, uint8_t space[NSPV_ENCRYPTED_MAXSIZE + crypto_box_ZEROBYTES], uint8_t* encoded, bits256 privkey)
{
    bits256 pubkey;
    uint8_t *extracted = 0, *nonce, *cipher;
    uint16_t msglen, ind;
    int32_t cipherlen, len = 4;
    *recvlenp = 0;
    *indp = -1;
    pubkey = acct777_pubkey(privkey);
    msglen = ((int32_t)encoded[1] << 8) | encoded[0];
    ind = ((int32_t)encoded[3] << 8) | encoded[2];
    nonce = &encoded[len];
    cipher = &encoded[len + crypto_box_NONCEBYTES];
    cipherlen = msglen - (len + crypto_box_NONCEBYTES);
    if (cipherlen > 0 && cipherlen <= NSPV_ENCRYPTED_MAXSIZE + crypto_box_ZEROBYTES) {
        if ((extracted = _SuperNET_decipher(nonce, cipher, space, cipherlen, pubkey, privkey)) != 0) {
            //int32_t i; for (i=0; i<msglen&&i<64; i++)
            //    fprintf(stderr,"%02x",extracted[i]);
            //fprintf(stderr," extracted\n");
            msglen = (cipherlen - crypto_box_ZEROBYTES);
            *recvlenp = msglen;
            *indp = ind;
        }
    } //else fprintf(stderr,"cipher.%d too big for %d\n",cipherlen,NSPV_ENCRYPTED_MAXSIZE + crypto_box_ZEROBYTES);
    return (extracted);
}


#ifdef _WIN32
#define in6_addr sockaddr
#define in_addr_t struct sockaddr_storage

#ifndef NATIVE_WINDOWS
#define EAFNOSUPPORT WSAEAFNOSUPPORT
#endif

/*struct sockaddr_in6 {
    short   sin6_family;
    u_short sin6_port;
    u_long  sin6_flowinfo;
    struct  in6_addr sin6_addr;
    u_long  sin6_scope_id;
};*/
#else
#endif

#ifdef _WIN32
#ifdef AF_INET6
#undef AF_INET6
#endif
#define AF_INET6 23
#endif

static int inet_ntop4(unsigned char* src, char* dst, size_t size);
static int inet_ntop6(unsigned char* src, char* dst, size_t size);
static int inet_pton4(char* src, unsigned char* dst);
static int inet_pton6(char* src, unsigned char* dst);

int32_t portable_ntop(int af, void* src, char* dst, size_t size)
{
    switch (af) {
    case AF_INET:
        return (inet_ntop4(src, dst, size));
    case AF_INET6:
        return (inet_ntop6(src, dst, size));
    default:
        return -1;
    }
    /* NOTREACHED */
}


static int inet_ntop4(unsigned char* src, char* dst, size_t size)
{
    static const char fmt[] = "%u.%u.%u.%u";
    char tmp[sizeof "255.255.255.255"];
    int l;

#ifndef _WIN32
    l = snprintf(tmp, sizeof(tmp), fmt, src[0], src[1], src[2], src[3]);
#else
    l = _snprintf(tmp, sizeof(tmp), fmt, src[0], src[1], src[2], src[3]);
#endif
    if (l <= 0 || (size_t)l >= size) {
        return -1;
    }
    strncpy(dst, tmp, size);
    dst[size - 1] = '\0';
    return 0;
}

static int inet_ntop6(unsigned char* src, char* dst, size_t size)
{
    /*
     * Note that int32_t and int16_t need only be "at least" large enough
     * to contain a value of the specified size.  On some systems, like
     * Crays, there is no such thing as an integer variable with 16 bits.
     * Keep this in mind if you think this function should have been coded
     * to use pointer overlays.  All the world's not a VAX.
     */
    char tmp[sizeof "ffff:ffff:ffff:ffff:ffff:ffff:255.255.255.255"], *tp;
    struct {
        int base, len;
    } best, cur;
    unsigned int words[sizeof(struct in6_addr) / sizeof(uint16_t)];
    int i;

    /*
     * Preprocess:
     *  Copy the input (bytewise) array into a wordwise array.
     *  Find the longest run of 0x00's in src[] for :: shorthanding.
     */
    memset(words, '\0', sizeof words);
    for (i = 0; i < (int)sizeof(struct in6_addr); i++)
        words[i / 2] |= (src[i] << ((1 - (i % 2)) << 3));
    best.base = -1;
    best.len = 0;
    cur.base = -1;
    cur.len = 0;
    for (i = 0; i < (int)(sizeof(struct in6_addr) / sizeof(uint16_t)); i++) {
        if (words[i] == 0) {
            if (cur.base == -1)
                cur.base = i, cur.len = 1;
            else
                cur.len++;
        } else {
            if (cur.base != -1) {
                if (best.base == -1 || cur.len > best.len)
                    best = cur;
                cur.base = -1;
            }
        }
    }
    if (cur.base != -1) {
        if (best.base == -1 || cur.len > best.len)
            best = cur;
    }
    if (best.base != -1 && best.len < 2)
        best.base = -1;

    /*
     * Format the result.
     */
    tp = tmp;
    for (i = 0; i < (int)(sizeof(struct in6_addr) / sizeof(uint16_t)); i++) {
        /* Are we inside the best run of 0x00's? */
        if (best.base != -1 && i >= best.base &&
            i < (best.base + best.len)) {
            if (i == best.base)
                *tp++ = ':';
            continue;
        }
        /* Are we following an initial run of 0x00s or any real hex? */
        if (i != 0)
            *tp++ = ':';
        /* Is this address an encapsulated IPv4? */
        if (i == 6 && best.base == 0 && (best.len == 6 || (best.len == 7 && words[7] != 0x0001) || (best.len == 5 && words[5] == 0xffff))) {
            int err = inet_ntop4(src + 12, tp, sizeof tmp - (tp - tmp));
            if (err)
                return err;
            tp += strlen(tp);
            break;
        }
        tp += sprintf(tp, "%x", words[i]);
    }
    /* Was it a trailing run of 0x00's? */
    if (best.base != -1 && (best.base + best.len) == (sizeof(struct in6_addr) / sizeof(uint16_t)))
        *tp++ = ':';
    *tp++ = '\0';

    /*
     * Check for overflow, copy, and we're done.
     */
    if ((size_t)(tp - tmp) > size) {
        return ENOSPC;
    }
    strcpy(dst, tmp);
    return 0;
}

static int inet_pton4(char* src, unsigned char* dst)
{
    static const char digits[] = "0123456789";
    int saw_digit, octets, ch;
    unsigned char tmp[sizeof(struct in_addr)], *tp;
    char savestr[64];
    strcpy(savestr, src);

    //printf("inet_pton4(%s)\n",src);
    saw_digit = 0;
    octets = 0;
    *(tp = tmp) = 0;
    while ((ch = (uint8_t)*src++) != '\0') {
        char* pch;
        if ((pch = strchr(digits, ch)) != NULL) {
            unsigned int nw = (unsigned int)(*tp * 10 + (pch - digits));
            if (saw_digit && *tp == 0) {
                printf("inet_pton4 0\n");
                return EINVAL;
            }
            if (nw > 255) {
                printf("inet_pton4 1\n");
                return EINVAL;
            }
            *tp = nw;
            if (!saw_digit) {
                if (++octets > 4) {
                    printf("inet_pton4 2\n");
                    return EINVAL;
                }
                saw_digit = 1;
            }
        } else if (ch == '.' && saw_digit) {
            if (octets == 4) {
                printf("inet_pton4 3\n");
                return EINVAL;
            }
            *++tp = 0;
            saw_digit = 0;
        } else {
            printf("inet_pton4 4 error.(%s)\n", savestr); //getchar();
            return EINVAL;
        }
    }
    if (octets < 4) {
        printf("inet_pton4 5 error.(%s)\n", savestr); //getchar();
        return EINVAL;
    }
    memcpy(dst, tmp, sizeof(struct in_addr));
    //printf("not errors %08x\n",*(int32_t *)dst);
    return 0;
}


static int inet_pton6(char* src, unsigned char* dst)
{
    static char xdigits_l[] = "0123456789abcdef",
                xdigits_u[] = "0123456789ABCDEF";
    unsigned char tmp[sizeof(struct in6_addr)], *tp, *endp, *colonp;
    char *xdigits, *curtok;
    int ch, seen_xdigits;
    unsigned int val;

    memset((tp = tmp), '\0', sizeof tmp);
    endp = tp + sizeof tmp;
    colonp = NULL;
    /* Leading :: requires some special handling. */
    if (*src == ':')
        if (*++src != ':')
            return EINVAL;
    curtok = src;
    seen_xdigits = 0;
    val = 0;
    while ((ch = *src++) != '\0' && ch != '%') {
        char* pch;

        if ((pch = strchr((xdigits = xdigits_l), ch)) == NULL)
            pch = strchr((xdigits = xdigits_u), ch);
        if (pch != NULL) {
            val <<= 4;
            val |= (pch - xdigits);
            if (++seen_xdigits > 4)
                return EINVAL;
            continue;
        }
        if (ch == ':') {
            curtok = src;
            if (!seen_xdigits) {
                if (colonp)
                    return EINVAL;
                colonp = tp;
                continue;
            } else if (*src == '\0') {
                return EINVAL;
            }
            if (tp + sizeof(uint16_t) > endp)
                return EINVAL;
            *tp++ = (unsigned char)(val >> 8) & 0xff;
            *tp++ = (unsigned char)val & 0xff;
            seen_xdigits = 0;
            val = 0;
            continue;
        }
        if (ch == '.' && ((tp + sizeof(struct in_addr)) <= endp)) {
            int err;

            /* Scope id present, parse ipv4 addr without it */
            pch = strchr(curtok, '%');
            if (pch != NULL) {
                char tmp2[sizeof "255.255.255.255"];

                memcpy(tmp2, curtok, pch - curtok);
                curtok = tmp2;
                src = pch;
            }

            err = inet_pton4(curtok, tp);
            if (err == 0) {
                tp += sizeof(struct in_addr);
                seen_xdigits = 0;
                break; /*%< '\\0' was seen by inet_pton4(). */
            }
        }
        return EINVAL;
    }
    if (seen_xdigits) {
        if (tp + sizeof(uint16_t) > endp)
            return EINVAL;
        *tp++ = (unsigned char)(val >> 8) & 0xff;
        *tp++ = (unsigned char)val & 0xff;
    }
    if (colonp != NULL) {
        /*
         * Since some memmove()'s erroneously fail to handle
         * overlapping regions, we'll do the shift by hand.
         */
        int n = (int)(tp - colonp);
        int i;

        if (tp == endp)
            return EINVAL;
        for (i = 1; i <= n; i++) {
            endp[-i] = colonp[n - i];
            colonp[n - i] = 0;
        }
        tp = endp;
    }
    if (tp != endp)
        return EINVAL;
    memcpy(dst, tmp, sizeof tmp);
    return 0;
}

uint16_t parse_ipaddr(char* ipaddr, char* ip_port)
{
    int32_t j;
    uint16_t port = 0;
    if (ip_port != 0 && ip_port[0] != 0) {
        strcpy(ipaddr, ip_port);
        for (j = 0; ipaddr[j] != 0 && j < 60; j++)
            if (ipaddr[j] == ':') {
                port = atoi(ipaddr + j + 1);
                break;
            }
        ipaddr[j] = 0;
        //printf("%p.(%s) -> (%s:%d)\n",ip_port,ip_port,ipaddr,port);
    } else
        strcpy(ipaddr, "127.0.0.1");
    return (port);
}

uint64_t _calc_ipbits(char* ip_port)
{
    int32_t port;
    char ipaddr[64];
    struct sockaddr_in addr;
    port = parse_ipaddr(ipaddr, ip_port);
    memset(&addr, 0, sizeof(addr));
    portable_pton(ip_port[0] == '[' ? AF_INET6 : AF_INET, ipaddr, &addr);
    if ((0)) {
        int i;
        for (i = 0; i < 16; i++)
            printf("%02x ", ((uint8_t*)&addr)[i]);
        printf("<- %s %x\n", ip_port, *(uint32_t*)&addr);
    }
    return (*(uint32_t*)&addr | ((uint64_t)port << 32));
}

uint64_t calc_ipbits(char* ip_port)
{
    uint64_t ipbits = 0;
    char ipaddr[64], ipaddr2[64];
    int32_t i;
    if (ip_port != 0) {
        ipbits = _calc_ipbits(ip_port);
        expand_ipbits(ipaddr, ipbits);
        if (ipbits != 0 && strcmp(ipaddr, ip_port) != 0) {
            for (i = 0; i < 63; i++)
                if ((ipaddr[i] = ip_port[i]) == ':' || ipaddr[i] == 0)
                    break;
            ipaddr[i] = 0;
            ipbits = _calc_ipbits(ipaddr);
            expand_ipbits(ipaddr2, ipbits);
            if (ipbits != 0 && strcmp(ipaddr, ipaddr2) != 0) {
                if (ipaddr[0] != 0)
                    printf("calc_ipbits error: (%s) -> %llx -> (%s)\n", ip_port, (long long)ipbits, ipaddr); //, getchar();
                ipbits = 0;
            }
        }
    }
    return (ipbits);
}

char* ipbits_str(char ipaddr[64], uint64_t ipbits)
{
    expand_ipbits(ipaddr, ipbits);
    return (ipaddr);
}

uint32_t is_ipaddr(char* str)
{
    uint64_t ipbits;
    char ipaddr[64];
    if (str != 0 && str[0] != 0 && (ipbits = calc_ipbits(str)) != 0) {
        expand_ipbits(ipaddr, (uint32_t)ipbits);
        if (strncmp(ipaddr, str, strlen(ipaddr)) == 0)
            return ((uint32_t)ipbits);
    }
    // printf("(%s) is not ipaddr\n",str);
    return (0);
}

int portable_pton(int af, char* src, void* dst)
{
    switch (af) {
    case AF_INET:
        return (inet_pton4(src, dst));
    case AF_INET6:
        return (inet_pton6(src, dst));
    default:
        return EAFNOSUPPORT;
    }
    /* NOTREACHED */
}

void expand_ipbits(char* ipaddr, uint64_t ipbits)
{
    uint16_t port;
    struct sockaddr_in addr;
    memset(&addr, 0, sizeof(addr));
    *(uint32_t*)&addr = (uint32_t)ipbits;
    portable_ntop(AF_INET, &addr, ipaddr, 64);
    if ((port = (uint16_t)(ipbits >> 32)) != 0)
        sprintf(ipaddr + strlen(ipaddr), ":%d", port);
    //sprintf(ipaddr,"%d.%d.%d.%d",(ipbits>>24)&0xff,(ipbits>>16)&0xff,(ipbits>>8)&0xff,(ipbits&0xff));
}

// writes compact size and variable to the end of the message
// adds buffer space
// if ppmsg is empty, it should be inited as NULL
void write_compact_size_and_msg(uint8_t **ppmsg, uint32_t *pmsg_len, uint8_t *var, uint64_t var_len)
{
    uint32_t new_len;
    if (var_len < 1)
        return;
    else if (var_len < 253)    {  
        *ppmsg = realloc(*ppmsg, *pmsg_len + var_len + 1);
        (*ppmsg)[*pmsg_len] = var_len;  // this byte contains length 1..253
        memcpy(&((*ppmsg)[*pmsg_len + 1]), var, var_len);
        *pmsg_len += var_len + 1;
    }
    else if (var_len <= 0xFFFFu)    {
        uint16_t os_var_len = htole16(var_len);

        *ppmsg = realloc(*ppmsg, *pmsg_len + var_len + 3);
        (*ppmsg)[*pmsg_len] = 253;  // next two bytes contain var length
        (*ppmsg)[*pmsg_len + 1] = *((uint8_t*)&os_var_len);
        (*ppmsg)[*pmsg_len + 2] = *((uint8_t*)&os_var_len + 1);
        memcpy(&((*ppmsg)[*pmsg_len + 3]), var, var_len);    
        *pmsg_len += var_len + 3;
    }
    else if (var_len <= 0xFFFFFFFFu)    {
        uint32_t os_var_len = htole32(var_len);

        *ppmsg = realloc(*ppmsg, *pmsg_len + var_len + 5);
        *ppmsg[*pmsg_len] = 254;  // next four bytes contain var length
        (*ppmsg)[*pmsg_len + 1] = *((uint8_t*)&os_var_len);
        (*ppmsg)[*pmsg_len + 2] = *((uint8_t*)&os_var_len + 1);
        (*ppmsg)[*pmsg_len + 3] = *((uint8_t*)&os_var_len + 2);
        (*ppmsg)[*pmsg_len + 4] = *((uint8_t*)&os_var_len + 3);
        memcpy(&((*ppmsg)[*pmsg_len + 5]), var, var_len);    
        *pmsg_len += var_len + 5;
    }
    else {
        uint64_t os_var_len = htole64(var_len);

        *ppmsg = realloc(*ppmsg, *pmsg_len + var_len + 9);
        *ppmsg[*pmsg_len] = 255;  // next eight bytes contain var length
        (*ppmsg)[*pmsg_len + 1] = *((uint8_t*)&os_var_len);
        (*ppmsg)[*pmsg_len + 2] = *((uint8_t*)&os_var_len + 1);
        (*ppmsg)[*pmsg_len + 3] = *((uint8_t*)&os_var_len + 2);
        (*ppmsg)[*pmsg_len + 4] = *((uint8_t*)&os_var_len + 3);
        (*ppmsg)[*pmsg_len + 5] = *((uint8_t*)&os_var_len + 4);
        (*ppmsg)[*pmsg_len + 6] = *((uint8_t*)&os_var_len + 5);
        (*ppmsg)[*pmsg_len + 7] = *((uint8_t*)&os_var_len + 6);
        (*ppmsg)[*pmsg_len + 8] = *((uint8_t*)&os_var_len + 7);
        memcpy(&((*ppmsg)[*pmsg_len + 9]), var, var_len);    
        *pmsg_len += var_len + 9;    
    }
}


#endif // NSPV_UTILS_H
