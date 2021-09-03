import { createModel } from '@rematch/core';

import type { RootModel } from './models';

export type Asset = {
  name: string;
  ticker?: string;
  balance?: number;
  usd_value?: number;
};

export interface CurrentTransactionState {
  id: string;
  status: number;
  error: string;
}

const updateCurrTx = (state: CurrentTransactionState, key: string, value: string | number) => {
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
  } as CurrentTransactionState,
  reducers: {
    SET_TX_ID: (state, txid: string) => updateCurrTx(state, 'id', txid),
    SET_TX_STATUS: (state, txstatus: number) => updateCurrTx(state, 'status', txstatus),
    SET_TX_ERROR: (state, error: string) => updateCurrTx(state, 'error', error),
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
