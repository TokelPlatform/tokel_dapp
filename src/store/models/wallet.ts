import { createModel } from '@rematch/core';
import dotProp from 'dot-prop-immutable';

import type { RootModel } from './models';

export type Asset = {
  name: string;
  ticker?: string;
  balance?: number;
  usd_value?: number;
};
export interface WalletState {
  chosenAsset?: string;
  assets: Array<Asset>;
  currentTx: {
    id: string;
    status: number;
    error: string;
  };
}

export default createModel<RootModel>()({
  state: {
    chosenAsset: null,
    assets: [],
    currentTx: {
      id: '',
      status: 0,
    },
  } as WalletState,
  reducers: {
    SET_CHOSEN_ASSET: (state, chosenAsset: string) => ({
      ...state,
      chosenAsset,
    }),
    SET_ASSETS: (state, assets: Array<Asset>) => ({
      ...state,
      assets,
    }),
    UPDATE_ASSET_BALANCE: (state, asset: Asset) => {
      const indx = state.assets.findIndex(a => a.name === asset.name);
      return dotProp.set(state, `assets.${indx}.balance`, v => v + asset.balance);
    },
  },
  effects: {},
});
