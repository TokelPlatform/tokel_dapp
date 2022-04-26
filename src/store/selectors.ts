import { findIndex, size } from 'lodash-es';
import { createSelector } from 'reselect';

import { RootState } from './rematch';

export const selectTheme = (state: RootState) => state.environment.theme;
export const selectView = (state: RootState) => state.environment.view;
export const selectModal = (state: RootState) => state.environment.modal;
export const selectModalName = (state: RootState) => state.environment.modal.name;
export const selectModalOptions = (state: RootState) => state.environment.modal.options;
export const selectNspvStatus = (state: RootState) => state.environment.nspvStatus;
export const selectNetworkPrefs = (state: RootState) => state.environment.networkPrefs;
export const selectShowNetworkPrefs = (state: RootState) => state.environment.networkPrefs.show;

export const selectTokelPriceUSD = (state: RootState) => state.environment.tokelPriceUSD;

export const selectAccountAddress = (state: RootState) => state.account.address;
export const selectAccountPubKey = (state: RootState) => state.account.pubkey;
export const selectUnspentBalance = (state: RootState) => state.account.unspent?.balance;
export const selectUnspent = (state: RootState) => state.account.unspent ?? {};
export const selectChosenTransaction = (state: RootState) => state.account.chosenTx;
export const selectTransactions = (state: RootState) =>
  state.account.txs[state.account.address] ?? [];

export const selectTokenDetails = (state: RootState) => state.environment.tokenDetails;
export const selectMyTokenDetails = (state: RootState) =>
  Object.fromEntries(
    Object.entries(state.environment.tokenDetails).filter(([id]) =>
      Object.keys(state.wallet.tokenBalances)?.includes(id)
    )
  );

export const selectChosenAsset = (state: RootState) => state.wallet.chosenAsset;

export const selectLoginFeedback = (state: RootState) => state.environment.loginFeedback ?? null;
export const selectEnvError = (state: RootState) => state.environment.error ?? null;
export const selectAssets = (state: RootState) => state.wallet.assets;

export const selectChosenToken = (state: RootState) => state.wallet.chosenToken;
export const selectTokenBalances = (state: RootState) => state.account.unspent?.tokens ?? [];
export const selectActiveTokenIds = (state: RootState) => Object.keys(state.wallet.tokenBalances);

export const selectTokenFilterId = (state: RootState) => state.wallet.tokenFilterId;
export const selectTokenSearchTerm = (state: RootState) => state.wallet.tokenSearchTerm;

export const selectCurrentTx = (state: RootState) => state.currentTransaction;
export const selectCurrentTxId = (state: RootState) => state.currentTransaction.id;
export const selectCurrentTxStatus = (state: RootState) => state.currentTransaction.status;
export const selectCurrentTxError = (state: RootState) => state.currentTransaction.error;
export const selectCurrenTxTokenTx = (state: RootState) => state.currentTransaction.tokenTx;

export const selectKey = (state: RootState) => state.account.key;
export const selectSeed = (state: RootState) => state.account.seed;

// mktplace
export const selectOrderDetails = (state: RootState) => state.marketplace.orderDetails;
export const selectMyOrders = (state: RootState) => state.marketplace.myOrders;
export const selectMyOffers = (state: RootState) => state.marketplace.offers;
export const selectAllMyOffers = (state: RootState) =>
  Object.values(state.marketplace.offers)
    ?.flat()
    .filter(offer => Object.keys(state.wallet.tokenBalances).includes(offer.tokenid));

// derived
export const selectTokenCount = (state: RootState) => size(state.wallet.tokenBalances);

export const selectCurrentTokenBalance = (state: RootState) =>
  state.wallet.chosenToken ? state.wallet.tokenBalances[state.wallet.chosenToken] : null;

// computed
export const selectAccountReady = createSelector(
  [selectAccountAddress, selectAssets, selectTransactions, selectUnspentBalance],
  (address, assets, txs, balance) =>
    assets.length > 0 &&
    address &&
    ((txs.length === 0 && balance === 0) || (txs.length > 0 && balance >= 0))
);

export const selectCurrentAsset = createSelector(
  [selectChosenAsset, selectAssets],
  (chosenAsset, assets) => {
    const index = findIndex(assets, { name: chosenAsset });
    if (index !== -1) {
      return assets[index];
    }
    return null;
  }
);

export const selectCurrentTokenDetail = createSelector(
  [selectChosenToken, selectTokenDetails],
  (chosenToken, details) => (chosenToken ? details[chosenToken] : null)
);

export const selectCurrentTokenInfo = createSelector(
  [selectChosenToken, selectTokenBalances, selectTokenDetails],
  (chosenToken, balances, details) =>
    chosenToken ? { ...details[chosenToken], balance: balances[chosenToken] } : null
);
