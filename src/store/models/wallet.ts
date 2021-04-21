import { createModel } from '@rematch/core';

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
});
