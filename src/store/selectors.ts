import { RootState } from './rematch';

export const selectView = (state: RootState) => state.environment.view;
export const selectModal = (state: RootState) => state.environment.modal;

export const selectAccountAddress = (state: RootState) => state.account.address;
export const selectUnspentAddress = (state: RootState) => state.account.unspent?.address;
export const selectUnspentBalance = (state: RootState) => state.account.unspent?.balance;
export const selectUnspentUtxos = (state: RootState) => state.account.unspent?.utxos ?? [];
export const selectUnspent = (state: RootState) => state.account.unspent ?? [];
export const selectChosenTransaction = (state: RootState) => state.account.chosenTx;
export const selectTransactions = (state: RootState) =>
  state.account.txs[state.account.address] ?? [];
export const selectParsedTransactions = (state: RootState) => state.account.parsedTxs ?? [];
export const selectChosenAsset = (state: RootState) => state.wallet.chosenAsset;
export const selectAssets = (state: RootState) => state.wallet.assets ?? [];
export const selectCurrentTxId = (state: RootState) => state.wallet.currentTx.id;
export const selectCurrentTxStatus = (state: RootState) => state.wallet.currentTx.status;
export const selectCurrentTxError = (state: RootState) => state.wallet.currentTx.error;
