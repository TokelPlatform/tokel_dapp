import { createModel } from '@rematch/core';
import dotProp from 'dot-prop-immutable';

import {
  listTransactions,
  listUnspent,
  login as nspvLogin,
  logout as nspvLogout,
} from 'util/nspvlib';
import { TxType, UnspentType } from 'util/nspvlib-mock';
import {
  getAllTransactionDetails,
  parseSerializedTransaction,
  parseSpendTx,
  parseUnspent,
} from 'util/transactions';
import { getStillUnconfirmed } from 'util/transactionsHelper';

import type { RootModel } from './models';

export interface AccountState {
  address?: string;
  unspent?: UnspentType;
  txs: {
    [address: string]: Array<TxType>;
  };
  key: string;
  chosenTx: TxType;
}

interface LoginArgs {
  key: string;
  setError: (message: string) => void;
  setFeedback: (message: string) => void;
}

export default createModel<RootModel>()({
  state: {
    address: null,
    unspent: null,
    txs: {},
    key: null,
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
      newTxs = newTxs.map(tx => parseSerializedTransaction(tx, state.address));
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
  },
  effects: dispatch => ({
    async login({ key = null, setError, setFeedback }: LoginArgs) {
      setError(null);
      if (setFeedback) {
        setFeedback('Connecting to nspv...');
      }
      const userKey = key ?? this.key;
      if (!this.key) {
        this.SET_KEY(key);
      }
      nspvLogin(userKey)
        .then(async account => {
          this.SET_ADDRESS(account.address);
          if (setFeedback) {
            setFeedback('Logging in to nspv...');
          }

          const unspent = await listUnspent();
          this.SET_UNSPENT(unspent);
          dispatch.wallet.SET_ASSETS(parseUnspent(unspent));
          if (setFeedback) {
            setFeedback('Getting transactions...');
          }
          const transactions = await listTransactions(account.address);
          return getAllTransactionDetails(transactions.txids);
        })
        .then(txs => dispatch.account.SET_TXS(txs))
        .catch(e => {
          if (setFeedback) {
            setFeedback(null);
          }
          setError(e.message);
        });
    },
    async logout() {
      dispatch({ type: 'RESET_APP' });
      return nspvLogout();
    },
  }),
});
