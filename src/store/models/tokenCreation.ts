import { createModel } from '@rematch/core';

import type { RootModel } from './models';

export interface TokenCreationState {
  id: string;
  status: number;
  error: string;
}

const updateStatus = (state: TokenCreationState, key: string, value: string | number | boolean) => {
  return {
    ...state,
    [key]: value,
  };
};

export default createModel<RootModel>()({
  state: {
    id: null,
    status: 0,
    error: null,
  } as TokenCreationState,
  reducers: {
    SET_TX_ID: (state, txid: string) => updateStatus(state, 'id', txid),
    SET_TX_STATUS: (state, txstatus: number) => updateStatus(state, 'status', txstatus),
    SET_TX_ERROR: (state, error: string) => updateStatus(state, 'error', error),
    RESET_TX: () => {
      return {
        id: null,
        status: 0,
        error: null,
      };
    },
  },
  effects: {},
});
