import { createModel } from '@rematch/core';

import { listTransactions, listUnspent, login as nspvLogin } from 'util/nspvlib';
import { TxType, UnspentType } from 'util/nspvlib-mock';
import { parseSpendTx, parseTransactions } from 'util/transacations';

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
    ADD_NEW_TX: (state, tx: TxType, address: string) => {
      const parsedTx = parseSpendTx(tx);
      parsedTx.recepient = address;
      state.parsedTxs.unshift(parsedTx);
      return { ...state };
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
  effects: {
    async login({ key, setError }: LoginArgs) {
      setError('');
      nspvLogin(key)
        .then(async account => {
          const unspent = await listUnspent();
          const transactions = await listTransactions();
          this.SET_TXS(transactions.address, transactions.txids);
          this.SET_PARSED_TXS(parseTransactions(transactions.txids));
          console.log(transactions);
          this.SET_UNSPENT(unspent);
          this.SET_ADDRESS(account.address);
          return null;
        })
        .catch(e => setError(e.message));
    },
  },
});
