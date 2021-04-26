import { createModel } from '@rematch/core';

import { listUnspent, login as nspvLogin } from 'util/nspvlib';
// import { UnspentType, listUnspent, login as nspvLogin } from 'util/nspvlib-mock';
import { UnspentType } from 'util/nspvlib-mock';

import type { RootModel } from './models';

export interface AccountState {
  address?: string;
  unspent?: UnspentType;
}

interface LoginArgs {
  key: string;
  setError: (message: string) => void;
}

export default createModel<RootModel>()({
  state: { address: null, unspent: null } as AccountState,
  reducers: {
    SET_ADDRESS: (state, address: string) => ({
      ...state,
      address,
    }),
    SET_UNSPENT: (state, unspent: UnspentType) => ({
      ...state,
      unspent,
    }),
  },
  effects: {
    async login({ key, setError }: LoginArgs) {
      setError('');
      nspvLogin(key)
        .then(async account => {
          const unspent = await listUnspent();
          this.SET_UNSPENT(unspent);
          this.SET_ADDRESS(account.address);
          console.log(unspent);
          return null;
        })
        .catch(e => setError(e.message));
    },
  },
});
