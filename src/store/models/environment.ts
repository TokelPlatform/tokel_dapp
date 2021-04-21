import { createModel } from '@rematch/core';

import { ModalName, ViewType } from 'vars/defines';

import type { RootModel } from './models';

export interface EnvironmentState {
  view?: string;
  receiveModal?: string;
}

export default createModel<RootModel>()({
  state: { view: ViewType.DASHBOARD, receiveModal: ModalName.RECEIVE } as EnvironmentState,
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
