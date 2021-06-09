import storage from 'redux-persist/lib/storage';

import { RematchDispatch, RematchRootState, init } from '@rematch/core';
import persistPlugin from '@rematch/persist';

import { IS_PROD, ViewType } from 'vars/defines';

import { RootModel, models } from './models/models';

const rootPersistConfig = {
  key: 'root',
  storage,
};

const store = init({
  models,
  plugins: [IS_PROD && persistPlugin(rootPersistConfig)].filter(Boolean),
  redux: {
    devtoolOptions: {
      disabled: process.env.NODE_ENV === 'production',
    },
    rootReducers: {
      RESET_APP: () => {
        return {
          account: {
            address: null,
            unspent: null,
            txs: {},
            key: null,
            nspvFeedback: null,
          },
          wallet: {
            chosenAsset: null,
            assets: [],
            currentTx: {},
          },
          environment: {
            view: ViewType.DASHBOARD,
            modal: null,
          },
        };
      },
    },
  },
});

export const { getState, dispatch } = store;
export default store;

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
