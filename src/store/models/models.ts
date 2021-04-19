import { Models } from '@rematch/core';

import account from './account';
import environment from './environment';
import wallet from './wallet';

export interface RootModel extends Models<RootModel> {
  account: typeof account;
  environment: typeof environment;
  wallet: typeof wallet;
}

export const models: RootModel = { account, environment, wallet };
