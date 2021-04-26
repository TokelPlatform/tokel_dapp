import { createModel } from '@rematch/core';

import { broadcast, spend } from 'util/nspvlib';

import type { RootModel } from './models';

export type Asset = {
  name: string;
  ticker: string;
  balance: number;
  usd_value: number;
};
export interface WalletState {
  chosenAsset?: string;
  assets: Array<Asset>;
  currentTx: {
    id: string;
    status: number;
    broadcast: number;
  };
}

interface SpendArgs {
  address: string;
  amount: string;
}

export default createModel<RootModel>()({
  state: {
    chosenAsset: null,
    assets: [
      {
        name: 'Tokel Test',
        ticker: 'TKLTEST',
        balance: 1.2,
        usd_value: 3,
      },
      {
        name: 'Komodo',
        ticker: 'KMD',
        balance: 3.0002342,
        usd_value: 4,
      },
    ],
    currentTx: {
      id: '',
      status: 0,
      broadcast: 0,
    },
  } as WalletState,
  reducers: {
    SET_CHOSEN_ASSET: (state, chosenAsset: string) => ({
      ...state,
      chosenAsset,
    }),
    SET_CURRENT_TX_ID: (state, txid: string) => ({
      ...state,
      currentTx: {
        ...state.currentTx,
        id: txid,
      },
    }),
    SET_BROADCAST_STATUS: (state, txbroadcast: number) => ({
      ...state,
      currentTx: {
        ...state.currentTx,
        broadcast: txbroadcast,
      },
    }),
    SET_CURRENT_TX_STATUS: (state, txstatus: number) => ({
      ...state,
      currentTx: {
        ...state.currentTx,
        status: txstatus,
      },
    }),
  },
  effects: {
    async spend({ address, amount }: SpendArgs) {
      return spend(address, amount)
        .then(res => {
          if (res.result === 'success' && res.hex) {
            console.log(res);
            console.log(res.txid);
            this.SET_CURRENT_TX_ID(res.txid);
            return broadcast(res.hex);
          }
          return null;
        })
        .then(broadcasted => {
          if (broadcasted) {
            // retcode < 0 .. error, === 1 success
            this.SET_CURRENT_TX_STATUS(Number(broadcasted.retcode === 1));
          }

          return null;
        })
        .catch(e => {
          this.SET_CURRENT_TX_STATUS(-1);
          console.log(e.message);
        });
    },
  },
});
