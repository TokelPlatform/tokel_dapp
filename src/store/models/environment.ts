import { createModel } from '@rematch/core';
import dp from 'dot-prop-immutable';

import { ThemeName, themeNames } from 'util/theming';
import { TokenDetail } from 'util/token-types';
import { ModalName, ViewType } from 'vars/defines';

import type { RootModel } from './models';

const hex2ascii = (hex: string) => {
  let ascii = '';
  for (let i = 0; i < hex.length; i += 2)
    ascii += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return ascii;
};

export interface EnvironmentState {
  theme?: ThemeName;
  view?: string;
  modal?: string;
  tokenDetails: Record<string, TokenDetail>;
  loginFeedback: string;
  error: string;
  nspvStatus: boolean;
}

export default createModel<RootModel>()({
  state: {
    theme: themeNames[0],
    view: ViewType.DASHBOARD,
    modal: null,
    tokenDetails: {},
    loginFeedback: null,
    error: null,
    nspvStatus: true,
  } as EnvironmentState,
  reducers: {
    SET_THEME: (state, theme: string) => ({ ...state, theme }),
    SET_VIEW: (state, view: string) => ({ ...state, view }),
    SET_MODAL: (state, modal: ModalName | null) => ({ ...state, modal }),
    SET_TOKEN_DETAIL: (state, tokenId: string, detail: TokenDetail) => {
      const arbitrary = detail?.dataAsJson?.arbitrary;
      if (arbitrary) {
        detail.dataAsJson.arbitraryAsJson = JSON.parse(hex2ascii(arbitrary));
      }
      return dp.set(state, `tokenDetails.${tokenId}`, detail);
    },
    SET_LOGIN_FEEDBACK: (state, loginFeedback: string) => ({ ...state, loginFeedback }),
    SET_ERROR: (state, error: string) => ({ ...state, error }),
    UPDATE_NSPV_STATUS: (state, nspvStatus: boolean) => ({ ...state, nspvStatus }),
  },
});
