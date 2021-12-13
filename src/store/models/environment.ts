import { createModel } from '@rematch/core';
import dp from 'dot-prop-immutable';

import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { splitArrayInChunks } from 'util/helpers';
import { ThemeName, themeNames } from 'util/theming';
import { TokenDetail, TokenForm } from 'util/token-types';
import { DEFAULT_NETWORK, ModalName, NetworkType, ViewType } from 'vars/defines';

import type { RootModel } from './models';

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
  options: TokenForm | Record<string, unknown>;
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
      network: DEFAULT_NETWORK,
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
          detail.dataAsJson.arbitraryAsJson = JSON.parse(
            Buffer.from(arbitrary, 'hex').toString('utf-8')
          );
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
      // This batches infoTokel requests into chunks of 9, to be sent 1.1 seconds apart,
      //      so the node we're connected to doesn't get mad and shuts the door on us.
      const chunks = splitArrayInChunks(Object.keys(tokenBalances), 9);
      let count = 1;
      chunks.forEach(tokens => {
        setTimeout(
          () =>
            tokens.forEach(async tokenId =>
              sendToBitgo(BitgoAction.TOKEN_V2_INFO_TOKEL, { tokenId })
            ),
          count * 1100
        );
        count += 1;
      });
    },
  }),
});
