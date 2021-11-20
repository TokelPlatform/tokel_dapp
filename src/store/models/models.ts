import { Models } from '@rematch/core';

import account from './account';
import currentTransaction from './currentTransaction';
import environment from './environment';
import wallet from './wallet';
import tokenCreation from './tokenCreation';

export interface RootModel extends Models<RootModel> {
  account: typeof account;
  environment: typeof environment;
  wallet: typeof wallet;
  currentTransaction: typeof currentTransaction;
  tokenCreation: typeof tokenCreation;
}

export const models: RootModel = {
  account,
  environment,
  wallet,
  currentTransaction,
  tokenCreation,
};
