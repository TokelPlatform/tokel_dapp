import { createModel } from '@rematch/core';
import dp from 'dot-prop-immutable';

import { TICKER, TokenFilter } from 'vars/defines';

import type { RootModel } from './models';

export type Asset = {
  name: string;
  ticker?: string;
  balance?: number;
  usd_value?: number;
};

export type TFI = typeof TokenFilter[keyof typeof TokenFilter];
export type WalletState = {
  chosenAsset?: string;
  assets: Array<Asset>;
  chosenToken?: string;
  tokenBalances: Record<string, number>;
  tokenFilterId: TFI;
  tokenSearchTerm: string;
};

export default createModel<RootModel>()({
  state: {
    chosenAsset: TICKER,
    assets: [],
    chosenToken: null,
    tokenBalances: {},
    tokenFilterId: TokenFilter.ALL,
    tokenSearchTerm: '',
  } as WalletState,
  reducers: {
    // SET_CHOSEN_ASSET: (state, chosenAsset: string) => ({ ...state, chosenAsset }),
    SET_ASSETS: (state, assets: Array<Asset>) => ({ ...state, assets }),
    UPDATE_ASSET_BALANCE: (state, asset: Asset) => {
      const indx = state.assets.findIndex(a => a.name === asset.name);
      return dp.set(state, `assets.${indx}.balance`, v => v + asset.balance);
    },
    SET_TOKEN_FILTER_ID: (state, tokenFilterId: TFI) => ({ ...state, tokenFilterId }),
    SET_TOKEN_SEARCH_TERM: (state, tokenSearchTerm: string) => ({ ...state, tokenSearchTerm }),
    SET_CHOSEN_TOKEN: (state, chosenToken: string) => ({ ...state, chosenToken }),
    SET_TOKEN_BALANCES: (state, tokenBalances: Record<string, number>) => ({
      ...state,
      tokenBalances,
    }),
    UPDATE_TOKEN_BALANCE: (state, tokenid: string, balance: number) =>
      dp.set(state, `tokenBalances.${tokenid}`, v => v - balance),
  },
});
