import { createModel } from '@rematch/core';

import { ThemeName, themeNames } from 'util/theming';
import { ModalName, ViewType } from 'vars/defines';

import type { RootModel } from './models';

export interface EnvironmentState {
  theme?: ThemeName;
  view?: string;
  modal?: string;
  loginFeedback: string;
}

export default createModel<RootModel>()({
  state: { theme: themeNames[0], view: ViewType.DASHBOARD, modal: null } as EnvironmentState,
  reducers: {
    SET_THEME: (state, theme: string) => ({ ...state, theme }),
    SET_VIEW: (state, view: string) => ({ ...state, view }),
    SET_MODAL: (state, modal: ModalName | null) => ({ ...state, modal }),
    SET_LOGIN_FEEDBACK: (state, loginFeedback: string) => ({ ...state, loginFeedback }),
  },
});
