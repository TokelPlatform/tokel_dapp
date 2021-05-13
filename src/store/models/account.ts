import { createModel } from '@rematch/core';
import dotProp from 'dot-prop-immutable';

import {
  listTransactions,
  listUnspent,
  login as nspvLogin,
  logout as nspvLogout,
} from 'util/nspvlib';
import { TxType, UnspentType } from 'util/nspvlib-mock';
import { parseSpendTx, parseTransactions, parseUnspent } from 'util/transacations';
import { combineTxs, getStillUnconfirmed } from 'util/txHelper';

import environment from './environment';
import type { RootModel } from './models';

export interface AccountState {
  address?: string;
  unspent?: UnspentType;
  txs: {
    [address: string]: Array<TxType>;
  };
  key: string;
  parsedTxs: Array<TxType>;
  unconfirmedTxs: Array<TxType>;
  chosenTx: TxType;
}

interface LoginArgs {
  key: string;
  setError: (message: string) => void;
}

export default createModel<RootModel>()({
  state: {
    address: null,
    unspent: null,
    txs: {},
    key: null,
    parsedTxs: [],
    unconfirmedTxs: [],
  } as AccountState,
  reducers: {
    SET_ADDRESS: (state, address: string) => ({
      ...state,
      address,
    }),
    SET_TXS: (state, txs: Array<TxType>) => {
      let newTxs = [];
      let stillUnconfirmed = [];
      console.log('setting TXS');
      // these are completely new transactions for this address
      if (!state.txs[state.address] || state.txs[state.address].length === 0) {
        newTxs = txs;
      } else {
        // some transactions will be still unconfirmed and we want to keep those at the top of the list
        stillUnconfirmed = getStillUnconfirmed(txs, state.unconfirmedTxs);
        const unconfirmedIds = stillUnconfirmed.map(tx => tx.txid);
        newTxs = combineTxs(txs, unconfirmedIds, state.unconfirmedTxs);
      }
      let newState = dotProp.set(state, `txs.${state.address}`, newTxs);
      newState = dotProp.set(newState, 'unconfirmedTxs', stillUnconfirmed);
      return dotProp.set(newState, 'parsedTxs', parseTransactions(newTxs));
    },
    ADD_NEW_TX: (state, transaction: TxType) => {
      const parsedTx = parseSpendTx(transaction.newTx);
      parsedTx.recepient = transaction.recepient;
      const newState = dotProp.set(state, 'unconfirmedTxs', list => [parsedTx, ...list]);
      return dotProp.set(newState, 'parsedTxs', list => [parsedTx, ...list]);
    },
    SET_PARSED_TXS: (state, parsedTxs: Array<TxType>) => ({
      ...state,
      parsedTxs,
    }),
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
    async login({ key = null, setError }: LoginArgs) {
      setError('');
      const userKey = key || this.key;
      if (!this.key) {
        this.SET_KEY(key);
      }
      nspvLogin(userKey)
        .then(async account => {
          this.SET_ADDRESS(account.address);

          const unspent = await listUnspent();
          this.SET_UNSPENT(unspent);
          dispatch.wallet.SET_ASSETS(parseUnspent(unspent));

          const transactions = await listTransactions();
          this.SET_TXS(transactions.txids);

          return null;
        })
        .catch(e => setError(e.message));
    },
    async logout() {
      this.SET_ADDRESS(null);
      this.SET_KEY(null);
      this.SET_UNSPENT(null);
      return nspvLogout();
    },
  }),
});
