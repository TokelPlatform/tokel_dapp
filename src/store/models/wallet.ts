import { createModel } from '@rematch/core';
import dotProp from 'dot-prop-immutable';

import { broadcast, spend } from 'util/nspvlib';
import { spendSuccess } from 'util/transactions';
import { FEE, TICKER } from 'vars/defines';

import type { RootModel } from './models';

export type Asset = {
  name: string;
  ticker?: string;
  balance?: number;
  usd_value?: number;
};
export interface WalletState {
  chosenAsset?: string;
  assets: Array<Asset>;
  currentTx: {
    id: string;
    status: number;
    error: string;
  };
}

interface SpendArgs {
  address: string;
  amount: string;
}

const updateCurrTx = (state, key, value) => {
  return {
    ...state,
    currentTx: {
      ...state.currentTx,
      [key]: value,
    },
  };
};

export default createModel<RootModel>()({
  state: {
    chosenAsset: null,
    assets: [],
    currentTx: {
      id: '',
      status: 0,
    },
  } as WalletState,
  reducers: {
    SET_CHOSEN_ASSET: (state, chosenAsset: string) => ({
      ...state,
      chosenAsset,
    }),
    SET_CURRENT_TX_ID: (state, txid: string) => updateCurrTx(state, 'id', txid),
    SET_CURRENT_TX_STATUS: (state, txstatus: number) => updateCurrTx(state, 'status', txstatus),
    SET_CURRENT_TX_ERROR: (state, error: string) => updateCurrTx(state, 'error', error),
    SET_ASSETS: (state, assets: Array<Asset>) => ({
      ...state,
      assets,
    }),
    UPDATE_ASSET_BALANCE: (state, asset: Asset) => {
      const indx = state.assets.findIndex(a => a.name === asset.name);
      return dotProp.set(state, `assets.${indx}.balance`, v => v + asset.balance);
    },
  },
  effects: dispatch => ({
    async spend({ address, amount }: SpendArgs) {
      let newTx = null;
      this.SET_CURRENT_TX_ERROR(null);
      this.SET_CURRENT_TX_ID(null);
      this.SET_CURRENT_TX_STATUS(0);
      return spend(address, amount)
        .then(res => {
          if (res.result === 'success' && res.hex) {
            this.SET_CURRENT_TX_ID(res.txid);
            newTx = res;
            return broadcast(res.hex);
          }
          return null;
        })
        .then(broadcasted => {
          if (broadcasted) {
            const success = spendSuccess(broadcasted);
            this.SET_CURRENT_TX_STATUS(Number(success));
            if (success) {
              const value = Number(amount);
              dispatch.account.ADD_NEW_TX({
                tx: newTx,
                recepient: address,
                value,
                unconfirmed: true,
              });
              // update the balance after the transaction
              const updatedAsset = {
                name: TICKER,
                balance: -value - FEE,
              };
              dispatch.wallet.UPDATE_ASSET_BALANCE(updatedAsset);
            }
          }

          return null;
        })
        .catch(e => {
          this.SET_CURRENT_TX_STATUS(-1);
          this.SET_CURRENT_TX_ERROR(e.message);
          console.log(e.message);
        });
    },
  }),
});
