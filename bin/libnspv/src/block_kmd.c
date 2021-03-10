/*

 The MIT License (MIT)

 Copyright (c) 2016 Thomas Kerin
 Copyright (c) 2016 libbtc developers

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

 modified to support komodo block header

*/

#include <stddef.h>
#include <stdint.h>
#include <string.h>


#include <btc/block_kmd.h>

#include <btc/serialize.h>
#include <btc/sha2.h>
#include <btc/utils.h>

kmd_block_header* kmd_block_header_new()
{
    kmd_block_header* header;
    header = btc_calloc(1, sizeof(*header));

    return header;
}

void kmd_block_header_free(kmd_block_header* header)
{
    if (!header)
        return;

    header->version = 1;
    memset(&header->prev_block, 0, BTC_HASH_LENGTH);
    memset(&header->merkle_root, 0, BTC_HASH_LENGTH);
    memset(&header->final_sapling_root, 0, BTC_HASH_LENGTH);
    header->bits = 0;
    header->timestamp = 0;
    memset(header->nonce, '\0', sizeof(header->nonce));
    cstr_free(header->solution, true);
    btc_free(header);

}

int kmd_block_header_deserialize(kmd_block_header* header, struct const_buffer* buf)
{
    if (!deser_s32(&header->version, buf))
        return false;
    if (!deser_u256(header->prev_block, buf))
        return false;
    if (!deser_u256(header->merkle_root, buf))
        return false;
    if (!deser_u256(header->final_sapling_root, buf))
        return false;
    if (!deser_u32(&header->timestamp, buf))
        return false;
    if (!deser_u32(&header->bits, buf))
        return false;
    if (!deser_u256(header->nonce, buf))
        return false;
    if (!deser_varstr(&header->solution, buf))
        return false;

    return true;
}

void kmd_block_header_serialize(cstring* s, const kmd_block_header* header)
{
    ser_s32(s, header->version);
    ser_u256(s, header->prev_block);
    ser_u256(s, header->merkle_root);
    ser_u256(s, header->final_sapling_root);
    ser_u32(s, header->timestamp);
    ser_u32(s, header->bits);
    ser_u256(s, header->nonce);
    ser_varstr(s, header->solution);
}

void kmd_block_header_copy(kmd_block_header* dest, const kmd_block_header* src)
{
    dest->version = src->version;
    memcpy(&dest->prev_block, &src->prev_block, sizeof(src->prev_block));
    memcpy(&dest->merkle_root, &src->merkle_root, sizeof(src->merkle_root));
    memcpy(&dest->final_sapling_root, &src->final_sapling_root, sizeof(src->final_sapling_root));
    dest->timestamp = src->timestamp;
    dest->bits = src->bits;
    memcpy(dest->nonce, src->nonce, sizeof(uint256));
    cstr_free(dest->solution, true);
    dest->solution = cstr_new_cstr(src->solution);
}

btc_bool kmd_block_header_hash(kmd_block_header* header, uint256 hash)
{
    cstring* s = cstr_new_sz(80);
    kmd_block_header_serialize(s, header);

    sha256_Raw((const uint8_t*)s->str, s->len, hash);
    sha256_Raw(hash, SHA256_DIGEST_LENGTH, hash);
    cstr_free(s, true);

    btc_bool ret = true;
    return ret;
}
