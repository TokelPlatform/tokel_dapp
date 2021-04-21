import { createModel } from '@rematch/core';

import { ModalName, ViewType } from 'vars/defines';

import type { RootModel } from './models';

export interface EnvironmentState {
  view?: string;
  modal?: string;
}

export default createModel<RootModel>()({
  state: { view: ViewType.DASHBOARD, modal: ModalName.RECEIVE } as EnvironmentState,
  reducers: {
    SET_VIEW: (state, view: string) => ({
      ...state,
      view,
    }),
    SET_MODAL: (state, modal: ModalName | null) => ({
      ...state,
      modal,
    }),
  },
});
