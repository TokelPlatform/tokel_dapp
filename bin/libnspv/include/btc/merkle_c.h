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
// merkle_c.h : function prototypes to calculate the root of partial merkle tree (returned by txoutproof) 
//

#ifndef __MERKLE_C_H__
#define __MERKLE_C_H__

#include "block_kmd.h"

typedef struct partial_merkel_tree_ {
    uint32_t hashcount;
    uint256 *hashes;
    cstring *bytes;
    uint32_t txcount;
    uint8_t *bits;
    uint32_t bitscount;
    int fBad;
} partial_merkel_tree;

typedef struct merkle_block_ {
    kmd_block_header *pheader;
    partial_merkel_tree tree;
} merkle_block;


void init_mblock(merkle_block *pmblock);
void free_mblock_data(merkle_block *pmblock);
int GetProofMerkleRoot(uint8_t *proof, int prooflen, merkle_block *pMblock, vector *vmatch, uint256 mroot);


#endif
