// Copyright (c) 2009-2010 Satoshi Nakamoto
// Copyright (c) 2009-2014 The Bitcoin Core developers
// Distributed under the MIT software license, see the accompanying
// file COPYING or http://www.opensource.org/licenses/mit-license.php.

/******************************************************************************
* Copyright � 2014-2019 The SuperNET Developers.                             *
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

//
// merkle_c.c : calculates the root of partial merkle tree (returned by txoutproof) 
//

#include <btc/btc.h>
#include <btc/block_kmd.h>
#include <btc/cstr.h>
#include <btc/vector.h>
#include <btc/serialize.h>
#include <btc/hash.h>
#include <btc/utils.h>

#include <btc/merkle_c.h>

// TODO: do we need call the real function MAX_BLOCK_SIZE()?
#define MAX_BLOCK_SIZE(h) (4096 * 1024)

#define BEGIN(a)            ((uint8_t*)&(a))
#define END(a)              ((uint8_t*)&((&(a))[1]))


/** 
* Copied from komodo src merkleblock.cpp
*
* Data structure that represents a partial merkle tree.
*
* It represents a subset of the txid's of a known block, in a way that
* allows recovery of the list of txid's and the merkle root, in an
* authenticated way.
*
* The encoding works as follows: we traverse the tree in depth-first order,
* storing a bit for each traversed node, signifying whether the node is the
* parent of at least one matched leaf txid (or a matched txid itself). In
* case we are at the leaf level, or this bit is 0, its merkle node hash is
* stored, and its children are not explorer further. Otherwise, no hash is
* stored, but we recurse into both (or the only) child branch. During
* decoding, the same depth-first traversal is performed, consuming bits and
* hashes as they written during encoding.
*
* The serialization is fixed and provides a hard guarantee about the
* encoded size:
*
*   SIZE <= 10 + ceil(32.25*N)
*
* Where N represents the number of leaf nodes of the partial tree. N itself
* is bounded by:
*
*   N <= total_transactions
*   N <= 1 + matched_transactions*tree_height
*
* The serialization format:
*  - uint32     total_transactions (4 bytes)
*  - varint     number of hashes   (1-3 bytes)
*  - uint256[]  hashes in depth-first order (<= 32*N bytes)
*  - varint     number of bytes of flag bits (1-3 bytes)
*  - byte[]     flag bits, packed per 8 in a byte, least significant bit first (<= 2*N-1 bits)
* The size constraints follow from this.
*/

static void hash_of_concat(uint8_t *begin1, uint8_t *end1, uint8_t *begin2, uint8_t *end2, uint256 hash)
{
    size_t bufsize = (end1 - begin1) + (end2 - begin2);
    uint8_t *buf = btc_malloc(bufsize);
    if (buf == NULL)
        return;

    // fprintf(stderr, "end1-begin1=%d end2-begin2=%d\n", end1 - begin1, end2 - begin2);
    memcpy(buf, begin1, end1 - begin1);
    memcpy(buf + (end1 - begin1), begin2, end2 - begin2);
    btc_hash(buf, bufsize, hash);
    btc_free(buf);
}

/*
** init merkle_block object
*/
void init_mblock(merkle_block *pmblock)
{
    memset(pmblock, 0, sizeof(*pmblock));
    pmblock->pheader = kmd_block_header_new();
    pmblock->tree.fBad = true;
}

/*
** frees merkle_block allocated members
*/
void free_mblock_data(merkle_block *pmblock)
{
    if (pmblock->pheader)
        kmd_block_header_free(pmblock->pheader);
    if (pmblock->tree.bits)
        btc_free(pmblock->tree.bits);
    if (pmblock->tree.hashes)
        btc_free(pmblock->tree.hashes);
    if (pmblock->tree.bytes)
        cstr_free(pmblock->tree.bytes, 1);
}

static int deserialize_proof(uint8_t *proof, int prooflen, merkle_block *pmblock)
{
    struct const_buffer proofbuf = { proof, prooflen };
    uint32_t i;

    if (proof == NULL)
        return false;

    /* deserialize block */
    if (!kmd_block_header_deserialize(pmblock->pheader, &proofbuf)) {
        fprintf(stderr, "could not deserialize block header from proof\n");
        return false;
    }

    /* deserialize tx number */
    if (!deser_u32(&pmblock->tree.txcount, &proofbuf)) {
        fprintf(stderr, "could not deserialize txcount from proof\n");
        return false;
    }

    /* deserialize hashes */
    if( !deser_varlen(&pmblock->tree.hashcount, &proofbuf))     {  // get hashes array len
        fprintf(stderr, "could not deserialize hashcount from proof\n");
        return false;
    }

    pmblock->tree.hashes = btc_malloc(pmblock->tree.hashcount * sizeof(*pmblock->tree.hashes));  // alloc mem
    if (pmblock->tree.hashes == NULL) {
        fprintf(stderr, "could not alloc mem for hashes\n");
        return false;
    }

    for (i = 0; i < pmblock->tree.hashcount; i++) {  // deserialize hashes
        if (!deser_u256(pmblock->tree.hashes[i], &proofbuf)) {
            fprintf(stderr, "could not deserialize hashes from proof\n");
            return false;
        }
    }

    /* deserialize bits */
    if (!deser_varstr(&pmblock->tree.bytes, &proofbuf)) {
        fprintf(stderr, "could not deserialize bits from proof\n");
        return false;
    }

    /* parse bits */
    pmblock->tree.bitscount = pmblock->tree.bytes->len * 8;
    pmblock->tree.bits = btc_malloc(pmblock->tree.bitscount);
    for (unsigned int p = 0; p < pmblock->tree.bitscount; p++)
        pmblock->tree.bits[p] = ((uint8_t)(pmblock->tree.bytes->str[p / 8]) & (1 << (p % 8))) != 0;

    //for (unsigned int i = 0; i < pmblock->tree.bitscount; i++)
    //    fprintf(stderr, "bits[%d] = %d\n", i, pmblock->tree.bits[i]);

    pmblock->tree.fBad = false;

    return true;
}

static unsigned int CalcTreeWidth(merkle_block *pmblock, int height) {
    return (pmblock->tree.txcount + (1 << height) - 1) >> height;
}

static int TraverseAndExtract(merkle_block *pMblock, int height, unsigned int pos, unsigned int *pBitsUsed, unsigned int *pHashUsed, vector *vMatch, uint256 mroot) 
{
    if (*pBitsUsed >= pMblock->tree.bitscount) {
        // overflowed the bits array - failure
        pMblock->tree.fBad = true;
        return false;
    }
    int fParentOfMatch = pMblock->tree.bits[(*pBitsUsed)++];
    if (height == 0 || !fParentOfMatch) {
        // if at height 0, or nothing interesting below, use stored hash and do not descend
        if (*pHashUsed >= pMblock->tree.hashcount) {
            // overflowed the hash array - failure
            pMblock->tree.fBad = true;
            memset(mroot, '\0', sizeof(uint256));
            return false;
        }
        uint8_t *phash = pMblock->tree.hashes[(*pHashUsed)++];
        if (height == 0 && fParentOfMatch) {// in case of height 0, we have a matched txid
            uint8_t *pnew = btc_malloc(sizeof(uint256)); // or uint256?
            memcpy(pnew, phash, sizeof(uint256));
            vector_add(vMatch, pnew);
        }

        memcpy(mroot, phash, sizeof(uint256));
        return true;
    }
    else {
        // otherwise, descend into the subtrees to extract matched txids and hashes
        uint256 left, right;

        memset(left, '\0', sizeof(left));
        memset(right, '\0', sizeof(right));

        TraverseAndExtract(pMblock, height - 1, pos * 2, pBitsUsed, pHashUsed, vMatch, left);
        // fprintf(stderr, "left="); for (int i = 0; i < sizeof(uint256); i++) fprintf(stderr, "%02x ", left[i]);  fprintf(stderr, "\n");
        
        if (pos * 2 + 1 < CalcTreeWidth(pMblock, height - 1)) {
            TraverseAndExtract(pMblock, height - 1, pos * 2 + 1, pBitsUsed, pHashUsed, vMatch, right);

            // fprintf(stderr, "right="); for (int i = 0; i < sizeof(uint256); i++) fprintf(stderr, "%02x ", right[i]); fprintf(stderr, "\n");

            if (memcmp(right, left, sizeof(right)) == 0) {
                // The left and right branches should never be identical, as the transaction
                // hashes covered by them must each be unique.
                pMblock->tree.fBad = true;
            }
        }
        else {
            memcpy(right, left, sizeof(right));
        }
        // and combine them before returning
        hash_of_concat(BEGIN(left), END(left), BEGIN(right), END(right), mroot);

    }
    return true;
}

static int ExtractMatches(merkle_block *pMblock, vector *vMatch, uint256 mroot) 
{
    //vMatch.clear();
    // An empty set will not work
    if (pMblock->tree.txcount == 0)
        return false;

    // check for excessively high numbers of transactions
    if (pMblock->tree.txcount > MAX_BLOCK_SIZE(10000000) / 60) // 60 is the lower bound for the size of a serialized CTransaction
        return false;
    // there can never be more hashes provided than one for every txid
    if (pMblock->tree.hashcount > pMblock->tree.txcount)
        return false;
    // there must be at least one bit per node in the partial tree, and at least one node per hash
    if (pMblock->tree.bitscount < pMblock->tree.hashcount)
        return false;
    // calculate height of tree
    int nHeight = 0;
    while (CalcTreeWidth(pMblock, nHeight) > 1)
        nHeight++;

    //fprintf(stderr, "nHeight=%d\n", nHeight);
    // traverse the partial tree
    unsigned int nBitsUsed = 0, nHashUsed = 0;
    if (!TraverseAndExtract(pMblock, nHeight, 0, &nBitsUsed, &nHashUsed, vMatch, mroot))
        return false;
    // verify that no problems occurred during the tree traversal
    if (pMblock->tree.fBad)
        return false;
    // verify that all bits were consumed (except for the padding caused by serializing it as a byte sequence)
    if ((nBitsUsed + 7) / 8 != (pMblock->tree.bitscount + 7) / 8)
        return false;
    // verify that all hashes were consumed
    if (nHashUsed != pMblock->tree.hashcount)
        return false;
    return true;
}

/*
** GetProofMerkleRoot
** parses proof data (from gettxoutproof komodod rpc) and returns matched transactions and calculated merkle root
** params:
** proof - proof data in binary
** prooflen - proof data length
** pMblock - merkle_block object inited with init_mblock() func. Clear it after usage with free_mblock_data()
** vmatch - vector object inited with vector_new(sizeof(uint256),...) func, here the matched txns from the merkle tree will be returned. 
**          Clear it with vector_free()
** mroot - merkle root object where calculated merkle root will be returned
*/
int GetProofMerkleRoot(uint8_t *proof, int prooflen, merkle_block *pMblock, vector *vmatch, uint256 mroot)
{
    if (!deserialize_proof(proof, prooflen, pMblock))
        return false;

    if (!ExtractMatches(pMblock, vmatch, mroot))
        return false;

    return true;
}


// tests for tx proof:
/**
int main()
{
 	vector *vmatch = NULL;   
    merkle_block mblock;
    uint256 mroot;
    uint8_t *proof;
    int prooflen;

    /// test set:
    char *proofhex[] =
    {
        "04000000e99a161138c314476f8bb68ed07ff5486f10df9ed551c718e9a1b614ffe06a053e2f28dc66f8ca00fc38d1bf25ecc696ce0718574bdbad796dcefe84a42f31fffbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e1a54335da090072005003f58e1e6ce2c678b46888dc937875ac55892274ec1a111da86cb71bf0000fd40050106155f02cb18316a74b240d92cf0cacf953b42a01463fdf1135919edb380c284585a6ad8e8386e2a561157040caef35455d7473551f2dfebdd9c9b9f79dc14b5a8fad84a623c6f72286953ed5bd6b129d786e0041d03efbf96c1618cd7504cdcdfd97d1b1fdfe4f619549f1d4e26d3ef4fe013598334ed81035e91c9730ddf9dde37a8d583ab380157c21d837d88322d19a3513475edcadfe12dab9727f892422be6b1c5f859e20420802de949f00394d980b86aaf5e6570462c5ecc09fcdb5521c2daf19e74e3a6127b3e575bc79fa30513996cdf0ea6205bf8252306ee7d35322edab4d7b81b4df5690c9316319777a2a7f6527c5e6201b460030cf202ff39c9ad44f12fc10a87e5a1d8e72e4af3a9203562122ff7f687f8951ae49860995f13e81c26af15b3a78dea88b7f793c79265cefc2208a90a5d899b300a4a6771a6dc5d49d9a5aa9de165858d8a8d10930258a8922191e784e22bf64b3a4c5d828c13b694b81bdf2b0f0de09909d5eb02cc3fdcc0f97330f7e5320d8e9d3e386569632d9031d71afeb81a020799fe4f21022f7b155e65ff5a756376e639a01ad0bb1a320e0ddbd98977493079de7655898232d09b1d327ef913161d0c7fbde59e333131e2acbbb76b752eaef038630e6629642cb30691ba864c583065564f45b4be40ea3df7f7be1c2bdb35f0c8841955ab7bbed56196d4b507cf641f4446abfd95dac223db33510d8cf5b66f561b559f066de5fe2ff80301c3f027d10c760b4a254f16ff23d9654622ff5b3051a738632a19ffeed645031dc271a7ec109ce6bbdfe9c3655e434277fabbf6400864935a738b0baaa109cacff9642b22fab797ffe75473dc2960ae6c35fb8846b6de7204779645dd0e3e177c515cae334345f40f662d43c6bb9692beba40ed34cd56d9639f318d1a114565326678ba0671dd7c3903a3e8bc134462b1057da116cbc8be0d6040f91f452815696fc8699d757bd657119ac83ef2f7fad9e3660934522c1686333434f1a2a0a1b2ea9ecb7e57333813dff7d9105cc57d952e36cd165ff9e232b1581ce5051df9f1654e79af63cfb10e2aafbe61b64b54310e0d9c3b169f5f041b48e96abd79de8fb7ca8ddf933205abeae5a69ca9df4fcca0cc4c95680833ab4281e120ca6c61ce1abfa34f1702a27ca0198dd255d85c6503e8ceb206d902c3f15241b6b7c7f75ca6844a269e05fa88a7db928524b2de12b5b7f39f82bc16f739c0168ebb5f12cc48c4e8ebe48c5e73503dbccfefa6a72cacf71465937814d730a3982cf24595921c3cb7d81b09f2ffb79735e0f83443bd97d3d0e8f0f2edbb9f1ce9434cb46360bb5e2b177887f927fe6f5c1f032d2b0e2490161fab0da76784329e5566d5fdd5dd61e2602c6c3264b3ed01ffae9883e6dde4ebd4485f74db040f477d7fe38cb1b8933653fd71be31db85f3f74d283d87ed0a67d48db4a1240eac7f19812ceeb02b633ae293bb3aefcbffb59403eddc2747425379ffde7d477fea42b3eb851f869f55977c5c8bb29d19be595b1011fccaec51a0a764fd97b74cdf512a7b617a8ca11844e774eb8b29db9057760a06d62401f9fc1f78a11c42e5fb9f578698d631c33f22d5f2ade1f79d87d03172bd6e9d19fed7e9d514dea678d205a7e7d06a8411a93f10596429ff98b0d4c3aabe280ecfddb720392958bfb879ea1e5dc712f3cc29bc34b960b63c1add3c382b78c46b50ffaa59d6d275c075420c6f9232025772d3026bb463f9bc63fc6325e52d8f20a1be09141524e4ac6c05cfa9b381d20f5cb052e0ca20fe637d6642b3cae33d035bf68f89e7dcf0691b61957f725a29f6124e98cbad3ac11a95d615c147aa0a20d2e01757609d2ed5aab9cdb71fd653dcbea082a329fdc7630200000002948efa16465d699e224299ed8839d255605cae83700f503b00dac49bb82efc3ed24f708694728cb570fac526ce514621494d7ce091ae457184ebc4f62e1d71cf0103",
        "04000000e99a161138c314476f8bb68ed07ff5486f10df9ed551c718e9a1b614ffe06a053e2f28dc66f8ca00fc38d1bf25ecc696ce0718574bdbad796dcefe84a42f31fffbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e1a54335da090072005003f58e1e6ce2c678b46888dc937875ac55892274ec1a111da86cb71bf0000fd40050106155f02cb18316a74b240d92cf0cacf953b42a01463fdf1135919edb380c284585a6ad8e8386e2a561157040caef35455d7473551f2dfebdd9c9b9f79dc14b5a8fad84a623c6f72286953ed5bd6b129d786e0041d03efbf96c1618cd7504cdcdfd97d1b1fdfe4f619549f1d4e26d3ef4fe013598334ed81035e91c9730ddf9dde37a8d583ab380157c21d837d88322d19a3513475edcadfe12dab9727f892422be6b1c5f859e20420802de949f00394d980b86aaf5e6570462c5ecc09fcdb5521c2daf19e74e3a6127b3e575bc79fa30513996cdf0ea6205bf8252306ee7d35322edab4d7b81b4df5690c9316319777a2a7f6527c5e6201b460030cf202ff39c9ad44f12fc10a87e5a1d8e72e4af3a9203562122ff7f687f8951ae49860995f13e81c26af15b3a78dea88b7f793c79265cefc2208a90a5d899b300a4a6771a6dc5d49d9a5aa9de165858d8a8d10930258a8922191e784e22bf64b3a4c5d828c13b694b81bdf2b0f0de09909d5eb02cc3fdcc0f97330f7e5320d8e9d3e386569632d9031d71afeb81a020799fe4f21022f7b155e65ff5a756376e639a01ad0bb1a320e0ddbd98977493079de7655898232d09b1d327ef913161d0c7fbde59e333131e2acbbb76b752eaef038630e6629642cb30691ba864c583065564f45b4be40ea3df7f7be1c2bdb35f0c8841955ab7bbed56196d4b507cf641f4446abfd95dac223db33510d8cf5b66f561b559f066de5fe2ff80301c3f027d10c760b4a254f16ff23d9654622ff5b3051a738632a19ffeed645031dc271a7ec109ce6bbdfe9c3655e434277fabbf6400864935a738b0baaa109cacff9642b22fab797ffe75473dc2960ae6c35fb8846b6de7204779645dd0e3e177c515cae334345f40f662d43c6bb9692beba40ed34cd56d9639f318d1a114565326678ba0671dd7c3903a3e8bc134462b1057da116cbc8be0d6040f91f452815696fc8699d757bd657119ac83ef2f7fad9e3660934522c1686333434f1a2a0a1b2ea9ecb7e57333813dff7d9105cc57d952e36cd165ff9e232b1581ce5051df9f1654e79af63cfb10e2aafbe61b64b54310e0d9c3b169f5f041b48e96abd79de8fb7ca8ddf933205abeae5a69ca9df4fcca0cc4c95680833ab4281e120ca6c61ce1abfa34f1702a27ca0198dd255d85c6503e8ceb206d902c3f15241b6b7c7f75ca6844a269e05fa88a7db928524b2de12b5b7f39f82bc16f739c0168ebb5f12cc48c4e8ebe48c5e73503dbccfefa6a72cacf71465937814d730a3982cf24595921c3cb7d81b09f2ffb79735e0f83443bd97d3d0e8f0f2edbb9f1ce9434cb46360bb5e2b177887f927fe6f5c1f032d2b0e2490161fab0da76784329e5566d5fdd5dd61e2602c6c3264b3ed01ffae9883e6dde4ebd4485f74db040f477d7fe38cb1b8933653fd71be31db85f3f74d283d87ed0a67d48db4a1240eac7f19812ceeb02b633ae293bb3aefcbffb59403eddc2747425379ffde7d477fea42b3eb851f869f55977c5c8bb29d19be595b1011fccaec51a0a764fd97b74cdf512a7b617a8ca11844e774eb8b29db9057760a06d62401f9fc1f78a11c42e5fb9f578698d631c33f22d5f2ade1f79d87d03172bd6e9d19fed7e9d514dea678d205a7e7d06a8411a93f10596429ff98b0d4c3aabe280ecfddb720392958bfb879ea1e5dc712f3cc29bc34b960b63c1add3c382b78c46b50ffaa59d6d275c075420c6f9232025772d3026bb463f9bc63fc6325e52d8f20a1be09141524e4ac6c05cfa9b381d20f5cb052e0ca20fe637d6642b3cae33d035bf68f89e7dcf0691b61957f725a29f6124e98cbad3ac11a95d615c147aa0a20d2e01757609d2ed5aab9cdb71fd653dcbea082a329fdc7630200000002948efa16465d699e224299ed8839d255605cae83700f503b00dac49bb82efc3ed24f708694728cb570fac526ce514621494d7ce091ae457184ebc4f62e1d71cf0105",
        "04000000db53583e6d2cb65ae92c0d1fbb75f713a2b353ab06549f0767797ee5249af4029520f70ce34dad9b908cd435cc7eb4bb99045565b5e428b4e92d7ae167f74f55fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493ef912335d501c07200000978eab3b6869c43f3551faa18d2b77326bfc5b301b3beefff1c5e7490000fd400500087b802ea6c93d407d0326b8308ea8f2acbe77ea01dd90f1860fd201458f5291b7772093677f3f2e150f36ba8491af1627e67eb7fc0ef6afca7819d9c6ea21e792fb9dd24fd6f5e7476646c24c970d00fcc8b10c36a298da4d436cade7018e93315e355ee5aef0cd4c46f60d9f62f27376c125592c465f82677878a70317cac7051dc8563e952ae2451c23bc2215029ad00b246c8b5f0edbad57e3c26611be7c5625d5b1f55b20005ac4c7d2f45719ff18d98172dbd53a7ad1598eae024c7ae96b128c91cc8441507bc3fed68892582895020282eb5c52220582b5e1c05e64b9e8df41f37fba06fa1ce105931ce9ac8224250af9706643a27d802105e96a891e54a7dd6c3842c76f2c9c61765171873131e6d6ee55cefd3fa2db149ec1664b6a6393b72d473c339c32d32f8ed5f2e448b32947c2d296fd19935540f2de2ef5932d1fc9c124142148bf85063b1de7df007c3d96ca8b2d079f176447c1a3fc41403b39f3213028db3534b458adc9690693cc7d1aa6270fb346f41166a8b34a27ece592a961896219e0b985b76cfe8016a4896c4165f017d3bd024c4130a381f72b3ad2ad03b63786cba2b5c3496b65c3194f35b7b0fc1d96c205d70e67af8ba50d16d07243dd6f9c811b652be68221c741caa32d1127930fe4ae616ef04225ff96103b45b94b57dd9d3848ffd9b5e0a366ad3660def7551202bc7c5fe7c236bfc9f2d08f40b87aa9b3ea3ae9541beb66d05d9e7ae9439076107038d80dd93e759a3e045a011a64ce8ddeefdbd878ac4e47d2d045df0f55275c5bf3bf2a62afb3172573a5ef9c21ca9b54ca9e0f9d26e4cd090bc4d10c84923fb350eb25621e83771bd6b3064e8c7dfd806b530ef7c33592e6dbfe05ef165a2a707e6731ff9bc48374b06c885d7bd213a6f1243dae6eef9f1b919d710425fa4ddc43f0555fa62d020457306ff1ffed983442711d7a874661203b4b45047d4f1446e71577949920ab638f998b33e43d6dc81417ad5f88518629f13c2175d8583f6c753e0a78871568cb9816999855b56bf6b2955917e1f5b4513a340991a2a07c52076103cb8267b873635566dcfa0f16153d7fbea7740413b2cb57e5097efd05ffb4dd96c63b5adbe0d25d12ad461cda7bb8faa332e1147fd666418ef2d5236518ddc14de46b016a73adc672aeb2c50842b3c51f91f63dae2a4367f0b1908d9b901de3b2824a57a227e7657db0fff9b11f76107673dcb6cabd2445e5332e2ab84f74c65997f3dcfceb10357b8ae5345a95696be15e17cb0ff3c75622015dfc739ed7ef135170a2db4a6579b03799092bf9d4da79d09e9e1e26c1f24d24f34a13eaddb39402a508be41087e9bea2b9e855ee50fbc45fdac73841b1c2b94f1f1e865353e3934468d95d8817eb759850df4afa3b4839fac54083c2f49f0c4ba239f4e84ecf5675782be1978594324c4c99353b2f005a4ece60b055c808b3edd9a7a200c6f11937554d497010ec0ea0e72fb1de922d4ff9a307d4fb0d5dc916bd9c5e626f3bad381e03d5dafd10a5b0669e7d44a7bba0d43c2f93b3f1941e36bd663428427e7b4d8b23b8433c865d0c8fc1229029abca70c0604eaa49fca3fcee8128e2e2efd466b235f816d0f075f587c2ad8e76be46a365dd40a4eabeaf777fd0998f0f44005a1587910845f39b3d3b6784ab8616d3df1a668f7f3a235c775f5a1a7cb7d69a6fcf6801c17b6527c5f9c0ecb7349d6eabdf59a720d04ffb80f2d74f9b12954713501c2c2e98f41eb9ae8473d308d121c10930e54baaf60c21636c5c8ba738e9eddef9123223941f91b9aff424c528ad41829ca8cefb5864a2004ddeaab678d856306369fa9bc94ce1b515b014823a111712c9c110b5b5d33f517d4a93a4325d515e6020000000248802bd7a4db7ea8c100e039e155192f2c26d32eceeee08eaca738bb582e373dbf8a3a1f02cd5e5f645cc8fbbbf0cb581bc3b4590ab6b915842e54cd388fcc930105",
        "040000004a632f497eea45aba97ad06eba906e92287249d4d91bafef7512955f159e3205a162f768b8db342c9583770a1ed0a28e68d0b731da606769fdf8bbb1f351a05dfbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e3b7fd05c0f0f0f2000000891f1ecd3c3b2445e7cfd32d01a0a70e08b5fe683d464544dde73410000fd40050057ec457de627b53b36e60c4650082da81112806d16e8b0c9f092f5e52dfa017b764a31dac0065e907e0a2f8e5ab402eb676443d33cca3c6695326adb5703269d6ef9a2ae75f196fd642158d7ad01cef3d9746f02eda94f134b0ad958d3b1ada4c91c7d6ab2f841a40de5edb60dca29cf831ee253c25d36cb2631dc4ab60478cc8d09a8d61ddd6fb084d37feea5102c8c4ef257571ec3015a8532e79d061c6abd4b75e63c14d5bc017c3e5058947b497c780612b73ccf425ef1dd5972332f7f03351c17039f12d6dbdde1810328d75a009e037c7bd09c071a7ef407426e893dd148f19e3aa0e726a35605431b44d37def981fb4ebf6bb50f8dc67ad073e05ccbb055933668981c609153b3d572e136ea728c18521f76234af47b8cc6665f64ed74d027e78052649ffb846dd98414f10d41e7475d0bb034a9a5c4042cfabe14f60931dc024e96672f83992933efd565200673121a68797eb19c6d53e702a962990da1207461859b1f09092d522b57581baa835d7d8c7f4470b8d05500ad3da60eb9561ba6973624c69ba5faa159ba611cd561a488b9d1cf941057d94476cfb557f3f53cf0fc51a7c9df8d221f16204ff2fcb910668e95d20361382afe073c6568f9dc8b4a812d8d112a0289cbf751093d2ea225c68f10f93f7be6f4eb45aee479db00f28e577c3bf1898ef5d05f530ba50c8e968e4d8d30d02a6bf943365616b6b2e250a392fee7da9919434d311dd42301f06027dc947c2c6a263f27cd4ecdf416e11638a4ff869b3f35d8551da99d2f98cfc5971b7c141079e730ae78339dc69b423fb33069613c29b795e05e999b4991ecd55c7fda36196e723396a80dd1e6d211a25ec555706412b28731441321cbed9be5db0db1fd587abb51144c56c5728188a496e4e8ddb5830b04d544ae0c0aefd47e9bc74e260675a46df6dba073900df740545a228993a21803edbad0b98187ae6e64f0cbd88b4e55100ed65ff85125af3703202983fb4660f5240efff2fc6e7cca0448e3bc3f96713681f10502008b5a1a150d30992be0470f3eee19e3e3a9e045e0bf80a96f061a1f9eb0f24bdd2eaef3e4d8c966a70249cd5526feacef187e713be36b614992112752cd021436b39bcd1c7c5775522da272ff53902ec9c1f3f22abd558775949e79cb3056a33d024de76d73c2f70054242ef48d819d13e33f3e2a62c1d3627dab6e9b513d49212fbc9d8d1a6f225ae76c7c766478c7b16491f33f7a3ba77a8ebd9c724b736e8ad2df0428f88fd4806cfbfc657fee8de06a4f8e5782039bd637a499d0b6c2c010caf4213da78c2e259704cea107812b8f9115694c5139a9640d953b830eb797bcfd9bdffcb8a12fa1e9af219ce5ecf39aa68da757982d1aabb2036185d34ab8b9329d5efe412cd71a5bacd64c8187cea01b3ee29d49e98a76adfbbaab66a3feaf0039deb8a2adb6a0ec19be2cb141c146711dfa5c5ae8db7d42c05af2e5dedd24807ecf0e414abf8ab02d8d416e2dd0ebdf647ba208e25fbb8520535fb2f68c0d7f27b63061f02c1ee6c65096e2cc35bf9cacdd184806edb7730a519bb799c28ad1b2ac557043afcda65161e737622f593c2a4cc32d78ed663fe9f689c818d3edb753c37f6c69818f6480dd772c8d190e90ac2f065fe35f90b5970801f03ce425089854f24759cc271d733ca0d1cf632c76c70a617f6ccf6bf324c1949c3c81324420d5bc340a2b79a6de5aae22943264ab6c8353beb275c3fd5bad337f6f9f5591bb472e67e770e52dddbc9159affa03012cc393c3ce5b493ff00ffbda3ddfe802f5fca542c652ed7de2d78cb3270c21eff0a1dd8712589dc39e65bb3a3377a561cb0d43169f670d0bb992c2e1787086b26059b77e54e47d6bd4aca2a5b028b0100000001a162f768b8db342c9583770a1ed0a28e68d0b731da606769fdf8bbb1f351a05d0101"
    };


    for (int p = 0; p < sizeof(proofhex) / sizeof(proofhex[0]); p++)
    {
        init_mblock(&mblock);
        proof = btc_malloc(strlen(proofhex[p]) / 2 + 1);

		vmatch = vector_new(sizeof(uint256), btc_free);

        utils_hex_to_bin(proofhex[p], proof, strlen(proofhex[p]), &prooflen);

        if (!GetProofMerkleRoot(proof, prooflen, &mblock, vmatch, mroot)) {
            printf("GetProofMerkleRoot returned false\n");
            return -1;
        }

        fprintf(stderr, "header mroot: ");
        for (int i = 0; i < sizeof(uint256); i++)
            printf("%02x ", mblock.pheader->merkle_root[i]);
        printf("\n");

        fprintf(stderr, "calced mroot: ");
        for (int i = 0; i < sizeof(uint256); i++)
            printf("%02x ", mroot[i]);
        printf("\n");

    	for (unsigned int m = 0; m < vmatch->len; m++)
	    {
    	    fprintf(stderr, "match %2d:     ", m);
        	for (int i = 0; i < sizeof(uint256); i++)
            	fprintf(stderr, "%02x ", ((uint8_t*)vmatch->data[m])[i]);
	        fprintf(stderr, "\n");
    	}

        fprintf(stderr, "\n");

	    vector_free(vmatch, true);

        free_mblock_data(&mblock);
        btc_free(proof);
    }
    
    return 0;
}
**/
