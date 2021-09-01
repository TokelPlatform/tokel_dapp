import { createModel } from '@rematch/core';
import dp from 'dot-prop-immutable';
import moment from 'moment';

import { broadcast, spend } from 'util/nspvlib';
import { spendSuccess } from 'util/transactionsHelper';
import { FEE, TICKER, TokenFilter } from 'vars/defines';

import type { RootModel } from './models';

export type Asset = {
  name: string;
  ticker?: string;
  balance?: number;
  usd_value?: number;
};

type SpendArgs = {
  address: string;
  amount: string;
};

export type TFI = typeof TokenFilter[keyof typeof TokenFilter];
export type WalletState = {
  chosenAsset?: string;
  assets: Array<Asset>;
  chosenToken?: string;
  tokenBalances: Record<string, number>;
  tokenFilterId: TFI;
  tokenSearchTerm: string;
  currentTx: {
    id: string;
    status: number;
    error: string;
  };
};

const updateCurrTx = (state: WalletState, key: string, value: unknown) => {
  return {
    ...state,
    currentTx: {
      ...state.currentTx,
      [key]: value,
    },
  };
};

export default createModel<RootModel>()({
  state: {
    chosenAsset: TICKER,
    assets: [],
    chosenToken: null,
    tokenBalances: {},
    tokenFilterId: TokenFilter.ALL,
    tokenSearchTerm: '',
    currentTx: {
      id: '',
      status: 0,
    },
  } as WalletState,
  reducers: {
    // SET_CHOSEN_ASSET: (state, chosenAsset: string) => ({ ...state, chosenAsset }),
    SET_ASSETS: (state, assets: Array<Asset>) => ({ ...state, assets }),
    UPDATE_ASSET_BALANCE: (state, asset: Asset) => {
      const indx = state.assets.findIndex(a => a.name === asset.name);
      return dp.set(state, `assets.${indx}.balance`, v => v + asset.balance);
    },
    SET_CHOSEN_TOKEN: (state, chosenToken: string) => ({ ...state, chosenToken }),
    SET_TOKEN_BALANCES: (state, tokenBalances: Record<string, number>) => ({
      ...state,
      tokenBalances,
    }),
});
