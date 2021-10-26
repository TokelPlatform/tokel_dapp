import { createModel } from '@rematch/core';
import dp from 'dot-prop-immutable';

import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { ThemeName, themeNames } from 'util/theming';
import { TokenDetail } from 'util/token-types';
import { ModalName, NetworkType, ViewType } from 'vars/defines';

import type { RootModel } from './models';

const hex2ascii = (hex: string) => {
  let ascii = '';
  for (let i = 0; i < hex.length; i += 2)
    ascii += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return ascii;
};

export type EnvironmentState = {
  theme?: ThemeName;
  view?: string;
  modal: Modal;
  tokenDetails: Record<string, TokenDetail>;
  tokelPriceUSD?: number;
  loginFeedback: string;
  error: string;
  nspvStatus: boolean;
  networkPrefs: NetworkPrefs;
};

export type Modal = {
  name: ModalName;
  options: Record<string, unknown>;
};

export const DEFAULT_NULL_MODAL: Modal = {
  name: null,
  options: {},
};

export type NetworkPrefs = {
  show: boolean;
  network: NetworkType;
  overrides: Record<string, unknown>;
};

export default createModel<RootModel>()({
  state: {
    theme: themeNames[0],
    view: ViewType.DASHBOARD,
    modal: DEFAULT_NULL_MODAL,
    tokenDetails: {},
    tokelPriceUSD: null,
    loginFeedback: null,
    error: null,
    nspvStatus: true,
    networkPrefs: {
      show: false,
      network: 'tkltest',
      overrides: {},
    },
  } as EnvironmentState,
  reducers: {
    SET_THEME: (state, theme: string) => ({ ...state, theme }),
    SET_VIEW: (state, view: string) => ({ ...state, view }),
    SET_MODAL: (state, modal: Modal) => ({ ...state, modal }),
    SET_MODAL_NAME: (state, modalName: ModalName) => dp.set(state, `modal.name`, modalName),
    SET_TOKEN_DETAIL: (state, detail: TokenDetail) => {
      const arbitrary = detail?.dataAsJson?.arbitrary;
      if (arbitrary) {
        try {
          detail.dataAsJson.arbitraryAsJson = JSON.parse(hex2ascii(arbitrary));
        } catch (e) {
          console.error(e);
        }
      }
      return dp.set(state, `tokenDetails.${detail.tokenid}`, detail);
    },
    SET_TOKEL_PRICE_USD: (state, tokelPriceUSD: number) => ({ ...state, tokelPriceUSD }),
    SET_LOGIN_FEEDBACK: (state, loginFeedback: string) => ({ ...state, loginFeedback }),
    SET_ERROR: (state, error: string) => ({ ...state, error }),
    UPDATE_NSPV_STATUS: (state, nspvStatus: boolean) => ({ ...state, nspvStatus }),
    SET_NETWORK: (state, networkPrefs: NetworkPrefs) => ({ ...state, networkPrefs }),
    SET_SHOW_NETWORK_PREFS: (state, show: boolean) => dp.set(state, `networkPrefs.show`, show),
    TOGGLE_SHOW_NETWORK_PREFS: state => dp.toggle(state, `networkPrefs.show`),
  },
  effects: () => ({
    async getTokenDetail(tokenBalances: string) {
      Object.keys(tokenBalances).map(async tokenId =>
        sendToBitgo(BitgoAction.TOKEN_V2_INFO_TOKEL, { tokenId })
      );
    },
  }),
});
