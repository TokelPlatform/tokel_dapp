import { createModel } from '@rematch/core';

import { spend } from 'util/nspvlib';

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
        name: 'Tokel',
        ticker: 'TKL',
        balance: 3.0002342,
        usd_value: 4,
      },
    ],
  } as WalletState,
  reducers: {
    SET_CHOSEN_ASSET: (state, chosenAsset: string) => ({
      ...state,
      chosenAsset,
    }),
  },
  effects: {
    async spend({ address, amount }: SpendArgs) {
      return spend(address, amount)
        .then(res => {
          console.log(res);
          return null;
        })
        .catch(e => console.log(e.message));
    },
  },
});
