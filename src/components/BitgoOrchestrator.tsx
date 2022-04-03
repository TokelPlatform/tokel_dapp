import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import BN from 'bn.js';
import { ipcRenderer } from 'electron';
import log from 'electron-log';

import { dispatch } from 'store/rematch';
import { selectAccountAddress } from 'store/selectors';
import { BitgoAction, checkData, sendToBitgo } from 'util/bitgoHelper';
import { getUnixTimestamp } from 'util/helpers';
import { parseUnspent } from 'util/transactions';
import { spendSuccess } from 'util/transactionsHelper';
import { BITGO_IPC_ID, IS_DEV, NspvJSErrorMessages } from 'vars/defines';

const BAD_WALLET_ERRORS = ['Error: RangeError: value out of range'];
export const BROKEN_WALLET_MSG =
  'The app could not connect to this wallet. Please report the error and try again later.';

const commonError = err => {
  log.error(err);
  if (BAD_WALLET_ERRORS.includes(err)) {
    dispatch.environment.SET_LOGIN_FEEDBACK(BROKEN_WALLET_MSG);
  } else {
    sendToBitgo(BitgoAction.RECONNECT);
    dispatch.environment.SET_LOGIN_FEEDBACK('Trying to connect to nspv...');
    dispatch.environment.UPDATE_NSPV_STATUS(false);
  }
};

const transactionError = err => {
  dispatch.currentTransaction.SET_TX_STATUS(-1);
  dispatch.currentTransaction.SET_TX_ERROR(NspvJSErrorMessages[err] || err);
  dispatch.environment.SET_ERROR(err);
  log.error(err);
};

const BitgoOrchestrator = () => {
  const myAddress = useSelector(selectAccountAddress);

  useEffect(() => {
    ipcRenderer.on(BITGO_IPC_ID, (_, payload) => {
      console.group('BITGO (ORCHESTRATOR)');
      if (IS_DEV) {
        console.group('BITGO (WORKER -> [MAIN] -> RENDERER)');
        console.log(checkData(payload));
        console.groupEnd();
      }
      console.groupEnd();
      if (payload.type === BitgoAction.SET_NETWORK) {
        dispatch.environment.SET_SHOW_NETWORK_PREFS(false);
      }
      // NEW ADDRESS
      if (payload.type === BitgoAction.NEW_ADDRESS) {
        const { wif, seed } = payload.data;
        dispatch.account.SET_KEY(wif);
        dispatch.account.SET_SEED(seed);
        return;
      }
      // SPEND
      if (payload.type === BitgoAction.SPEND) {
        if (payload.error) {
          transactionError(payload.error);
          return;
        }
        const success = spendSuccess(payload.data);
        dispatch.currentTransaction.SET_TX_STATUS(success);
        if (success) {
          dispatch.account.ADD_NEW_TX({
            txid: payload.data.txid,
            recipient: payload.data.address,
            from: [myAddress],
            timestamp: getUnixTimestamp(),
            value: new BN(payload.data.amount),
            unconfirmed: true,
          });
          dispatch.currentTransaction.SET_TX_ID(payload.data.txid);
        }
        return;
      }
      // TOKEN TRANSFER
      if (payload.type === BitgoAction.TOKEN_V2_TRANSFER) {
        if (payload.error) {
          transactionError(payload.error);
          return;
        }
        const success = spendSuccess(payload.data);
        dispatch.currentTransaction.SET_TX_STATUS(success);
        if (success) {
          dispatch.currentTransaction.SET_TX_ID(payload.data.txid);
          dispatch.currentTransaction.SET_TOKEN_TX(true);
          dispatch.wallet.UPDATE_TOKEN_BALANCE(payload.data.tokenid, payload.data.amount);
        }
        return;
      }
      // LOGIN
      if (payload.type === BitgoAction.LOGIN) {
        console.log('SHOULD BE RUNNING');
        if (payload.error) {
          console.log('SHOULD BE ERROR');
          dispatch.environment.SET_ERROR(`Bitgo Error (${payload.error})`);
          dispatch.environment.SET_LOGIN_FEEDBACK(null);
          log.error(payload.error);
          return;
        }
        dispatch.account.login({ data: payload.data });
        dispatch.environment.SET_LOGIN_FEEDBACK('Getting transactions...');
        const { address } = payload.data;
        sendToBitgo(BitgoAction.LIST_UNSPENT, { address });
        sendToBitgo(BitgoAction.LIST_TRANSACTIONS, { address });
        return;
      }
      // CREATE TOKEN
      if (payload.type === BitgoAction.TOKEN_V2_CREATE_TOKEL) {
        if (payload.error) {
          transactionError(payload.error);
          return;
        }
        const success = spendSuccess(payload.data);
        dispatch.currentTransaction.SET_TX_STATUS(success);
        dispatch.currentTransaction.SET_TX_ID(success ? payload.data.txid : null);
        dispatch.currentTransaction.SET_TOKEN_TX(true);
        return;
      }
      // HANDLE ALL OTHER ERRORS GENERICALLY
      if (payload.error) {
        commonError(payload.error);
        return;
      }
      // RECONNECT
      if (payload.type === BitgoAction.RECONNECT) {
        if (payload.data) {
          dispatch.environment.SET_ERROR(null);
          dispatch.environment.UPDATE_NSPV_STATUS(true);
          return;
        }
      }
      // LIST UNSPENT
      if (payload.type === BitgoAction.LIST_UNSPENT) {
        dispatch.wallet.SET_ASSETS(parseUnspent(payload.data.balance));
        dispatch.wallet.SET_TOKEN_BALANCES(payload.data.tokens);
        dispatch.environment.getTokenDetail(payload.data.tokens);
        dispatch.account.SET_UNSPENT(payload.data);
        return;
      }
      // LISTTRANSACTIONS
      if (payload.type === BitgoAction.LIST_TRANSACTIONS) {
        dispatch.account.SET_TXS(payload.data);
        return;
      }
      // TOKEN V2 ADDRESS
      if (payload.type === BitgoAction.TOKEN_V2_ADDRESS) {
        dispatch.account.SET_CC_DETAILS(payload.data);
      }
      // TOKEN_V2_INFO_TOKEL
      if (payload.type === BitgoAction.TOKEN_V2_INFO_TOKEL) {
        dispatch.environment.SET_TOKEN_DETAIL(payload.data);
      }
      // ASSET_V2_DECODE_ORDER
      if (payload.type === BitgoAction.ASSET_V2_DECODE_ORDER) {
        console.log(payload.data, 'ASSET_V2_DECODE_ORDER');
      }
    });
    return () => {
      ipcRenderer.removeAllListeners(BITGO_IPC_ID);
    };
  }, [myAddress]);

  return <div />;
};

export default BitgoOrchestrator;
