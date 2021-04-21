import { createModel } from '@rematch/core';

import type { RootModel } from './models';

export type Asset = {
  name: string;
  ticker: string;
  amount: number;
  price: number;
};
export interface WalletState {
  chosenAsset?: string;
  assets: Array<Asset>;
}

export default createModel<RootModel>()({
  state: {
    chosenAsset: null,
    assets: [
      {
        name: 'Tokel Test',
        ticker: 'TKLTEST',
        amount: 1.2,
        price: 3,
      },
      {
        name: 'Tokel',
        ticker: 'TKL',
        amount: 3.0002342,
        price: 4,
      },
    ],
  } as WalletState,
  reducers: {
    SET_CHOSEN_ASSET: (state, chosenAsset: string) => ({
      ...state,
      chosenAsset,
    }),
  },
});
