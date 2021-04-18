import { Models } from '@rematch/core';

import account from './account';
import environment from './environment';

export interface RootModel extends Models<RootModel> {
  account: typeof account;
  environment: typeof environment;
}

export const models: RootModel = { account, environment };
