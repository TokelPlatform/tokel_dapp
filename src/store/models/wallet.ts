import { createModel } from '@rematch/core';

import type { RootModel } from './models';

export interface WalletState {
  chosenAsset?: string;
}

export default createModel<RootModel>()({
  state: { chosenAsset: 'Total Holdings' } as WalletState,
  reducers: {
    SET_CHOSEN_ASSET: (state, chosenAsset: string) => ({
      ...state,
      chosenAsset,
    }),
  },
});
