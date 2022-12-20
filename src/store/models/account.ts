import { promises as fsp } from 'fs';

import { createModel } from '@rematch/core';
import dotProp from 'dot-prop-immutable';

import { USER_WALLET_DIR } from 'encryption/core';
import { TxType, UnspentType } from 'util/nspvlib-mock';
import { parseBlockchainTransaction, parseSpendTx } from 'util/transactions';
import { getStillUnconfirmed, getUniqueTransactionsFromIncoming } from 'util/transactionsHelper';
import { IWallet } from 'vars/types';

import type { RootModel } from './models';

export interface AccountState {
  blockHeight: number;
  wallets: Array<IWallet>;
  walletFileName?: string;
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
    blockHeight: null,
    wallets: [],
    walletFileName: undefined,
    address: null,
    unspent: null,
    txs: {},
    key: null,
    pubkey: null,
  } as AccountState,
  reducers: {
    SET_WALLET_FILES: (state, wallets: Array<IWallet>) => ({
      ...state,
      wallets,
    }),
    SET_WALLET_FILE_NAME: (state, walletName?: string) => ({
      ...state,
      walletFileName: walletName,
    }),
    SET_ADDRESS: (state, address: string) => ({
      ...state,
      address,
    }),
    SET_TXS: (state, txs: Array<TxType>) => {
      if (!state.address) {
        return state;
      }
      const unconfirmed = getStillUnconfirmed(txs, state.txs[state.address]);
      const newTxs = txs.map(tx => parseBlockchainTransaction(tx, state.address));
      const uniqueTransactions = getUniqueTransactionsFromIncoming(
        state.txs[state.address] ?? [],
        newTxs
      );
      const joinedTxs = unconfirmed
        .concat(uniqueTransactions)
        .concat(state.txs[state.address] ?? []);
      return dotProp.set(state, `txs.${state.address}`, joinedTxs);
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
    SET_HEIGHT: (state, blockHeight: number) => ({
      ...state,
      blockHeight,
    }),
  },
  effects: dispatch => ({
    async loadWallets() {
      const files = await fsp.readdir(USER_WALLET_DIR);
      const wallets = files
        .filter(r => r.endsWith('.wallet'))
        .sort()
        .map(filename => {
          const name = filename.split('.').slice(0, -1).join('.');
          return { name, filename };
        });
      dispatch.account.SET_WALLET_FILES(wallets);
    },
    async login({ data }: LoginArgs) {
      dispatch.account.SET_KEY(data.wif);
      dispatch.account.SET_PUBKEY(data.pubkey);
      dispatch.account.SET_ADDRESS(data.address);
    },
    logout() {
      dispatch({ type: 'RESET_APP' });
    },
  }),
});
