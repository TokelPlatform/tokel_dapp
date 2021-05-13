import { createModel } from '@rematch/core';
import dotProp from 'dot-prop-immutable';

import { listTransactions, listUnspent, login as nspvLogin } from 'util/nspvlib';
import { TxType, UnspentType } from 'util/nspvlib-mock';
import { parseSpendTx, parseTransactions, parseUnspent } from 'util/transacations';

import type { RootModel } from './models';

export interface AccountState {
  address?: string;
  unspent?: UnspentType;
  txs: {
    [address: string]: Array<TxType>;
  };
  parsedTxs: Array<TxType>;
  chosenTx: TxType;
}

interface LoginArgs {
  key: string;
  setError: (message: string) => void;
}

export default createModel<RootModel>()({
  state: { address: null, unspent: null, txs: {} } as AccountState,
  reducers: {
    SET_ADDRESS: (state, address: string) => ({
      ...state,
      address,
    }),
    SET_TXS: (state, address, txs) => ({
      ...state,
      txs: {
        ...txs,
        [address]: txs,
      },
    }),
    ADD_NEW_TX: (state, transaction: TxType) => {
      const parsedTx = parseSpendTx(transaction.newTx);
      parsedTx.recepient = transaction.recepient;
      return dotProp.set(state, 'parsedTxs', list => [parsedTx, ...list]);
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
  },
  effects: dispatch => ({
    async login({ key, setError }: LoginArgs) {
      setError('');
      nspvLogin(key)
        .then(async account => {
          const unspent = await listUnspent();
          const transactions = await listTransactions();
          this.SET_TXS(transactions.address, transactions.txids);
          this.SET_PARSED_TXS(parseTransactions(transactions.txids));
          this.SET_UNSPENT(unspent);
          dispatch.wallet.SET_ASSETS(parseUnspent(unspent));
          this.SET_ADDRESS(account.address);
          return null;
        })
        .catch(e => setError(e.message));
    },
  }),
});
