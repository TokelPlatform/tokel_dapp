import { createModel } from '@rematch/core';
import dotProp from 'dot-prop-immutable';

import { TxType, UnspentType } from 'util/nspvlib-mock';
import { tokenAddress, tokenInfoTokel } from 'util/token-mock';
import { parseSerializedTransaction, parseSpendTx } from 'util/transactions';
import { getStillUnconfirmed } from 'util/transactionsHelper';

import type { RootModel } from './models';

export interface AccountState {
  address?: string;
  unspent?: UnspentType;
  txs: {
    [address: string]: Array<TxType>;
  };
  key: string;
  seed: string;
  pubkey: string;
  chosenTx: TxType;
}

interface LoginArgs {
  data: {
    wif: string;
    address: string;
    seed: string;
    pubkey: string;
  };
  setError: (message: string) => void;
  setFeedback: (message: string) => void;
}

export default createModel<RootModel>()({
  state: {
    address: null,
    unspent: null,
    txs: {},
    key: null,
    pubkey: null,
  } as AccountState,
  reducers: {
    SET_ADDRESS: (state, address: string) => ({
      ...state,
      address,
    }),
    SET_TXS: (state, txs: Array<TxType>) => {
      if (!state.address) {
        return state;
      }
      const unconfirmed = getStillUnconfirmed(txs, state.txs[state.address]);
      let newTxs = [...unconfirmed, ...txs];
      newTxs = newTxs.map(tx => parseBlockchainTransaction(tx, state.address));
      return dotProp.set(state, `txs.${state.address}`, newTxs.flat());
    },
    ADD_NEW_TX: (state, transaction: TxType) =>
      dotProp.set(state, `txs.${state.address}`, list => [
        parseSpendTx(transaction, state.address),
        ...list,
      ]),
    SET_UNSPENT: (state, unspent: UnspentType) => ({
      ...state,
      unspent,
    }),
    SET_CHOSEN_TX: (state, chosenTx: TxType) => ({
      ...state,
      chosenTx,
    }),
    SET_KEY: (state, key: string) => ({
      ...state,
      key,
    }),
    SET_SEED: (state, seed: string) => ({
      ...state,
      seed,
    }),
    SET_PUBKEY: (state, pubkey: string) => ({
      ...state,
      pubkey,
    }),
    SET_CC_DETAILS: (state, ccdetails: string) => ({
      ...state,
      ccdetails,
    }),
  },
  effects: dispatch => ({
    async login({ data }: LoginArgs) {
      this.SET_KEY(data.wif);
      this.SET_PUBKEY(data.pubkey);
      this.SET_ADDRESS(data.address);
      // get token balances
      const tokenBalances = await tokenAddress(data.address);
      dispatch.wallet.SET_TOKEN_BALANCES(tokenBalances.balances);
      // get token detail
      Object.keys(tokenBalances.balances).map(async tokenId => {
        const detail = await tokenInfoTokel(tokenId);
        dispatch.environment.SET_TOKEN_DETAIL(tokenId, detail);
      });
    },
    logout() {
      dispatch({ type: 'RESET_APP' });
    },
  }),
});
