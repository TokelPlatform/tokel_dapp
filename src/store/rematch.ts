import storage from 'redux-persist/lib/storage';

import { RematchDispatch, RematchRootState, init } from '@rematch/core';
import persistPlugin from '@rematch/persist';

import { RootModel, models } from './models/models';

const persistConfig = {
  key: 'root',
  storage,
};

const store = init({
  models,
  plugins: [persistPlugin(persistConfig)],
  redux: {
    devtoolOptions: {
      disabled: process.env.NODE_ENV === 'production',
    },
  },
});

export const { getState, dispatch } = store;
export default store;

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
