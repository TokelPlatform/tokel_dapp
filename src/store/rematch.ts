import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';

import { RematchDispatch, RematchRootState, init } from '@rematch/core';
import persistPlugin from '@rematch/persist';

import { ViewType } from 'vars/defines';

import { RootModel, models } from './models/models';

const accountPersistConfig = {
  key: 'account',
  storage,
  whitelist: ['txs'],
  stateReconciler: autoMergeLevel2,
};

const store = init({
  models,
  plugins: [persistPlugin(accountPersistConfig)].filter(Boolean),
  redux: {
    devtoolOptions: {
      disabled: process.env.NODE_ENV === 'production',
    },
    rootReducers: {
      RESET_APP: state => {
        return {
          account: {
            address: null,
            unspent: state.account.unspent,
            key: null,
            nspvFeedback: null,
            txs: state.account.txs,
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
