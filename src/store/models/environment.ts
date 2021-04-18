import { createModel } from '@rematch/core';

import { ViewType } from 'vars/defines';

import type { RootModel } from './models';

export interface EnvironmentState {
  view?: string;
}

export default createModel<RootModel>()({
  state: { view: ViewType.DASHBOARD } as EnvironmentState,
  reducers: {
    SET_VIEW: (state, view: string) => ({
      ...state,
      view,
    }),
  },
});
