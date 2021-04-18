import { RematchDispatch, RematchRootState, init } from '@rematch/core';

import { RootModel, models } from './models/models';

const store = init({
  models,
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
