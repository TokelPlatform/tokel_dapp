import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ipcRenderer } from 'electron';

import { dispatch } from 'store/rematch';
import { selectAccountAddress } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { parseUnspent } from 'util/transactions';
import { spendSuccess } from 'util/transactionsHelper';
import { BITGO_IPC_ID, ErrorMessages } from 'vars/defines';

const commonError = () => {
  sendToBitgo(BitgoAction.RECONNECT);
  dispatch.environment.SET_LOGIN_FEEDBACK('Trying to connect to nspv...');
  dispatch.environment.UPDATE_NSPV_STATUS(false);
};

const BitgoOrchestrator = () => {
  const myAddress = useSelector(selectAccountAddress);

  useEffect(() => {
    ipcRenderer.on(BITGO_IPC_ID, (_, payload) => {
      console.group('BITGO (ORCHESTRATOR)');
      console.log(payload);
      console.groupEnd();
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
          dispatch.currentTransaction.SET_TX_STATUS(-1);
          dispatch.currentTransaction.SET_TX_ERROR(ErrorMessages.NETWORK_ISSUES);
          dispatch.environment.SET_ERROR(payload.error);
          return;
        }
        const success = spendSuccess(payload.data);
        dispatch.currentTransaction.SET_TX_STATUS(success);
        if (success) {
          dispatch.account.ADD_NEW_TX({
            txid: payload.data.txid,
            recipient: payload.data.address,
            from: [myAddress],
            timestamp: Date.now(),
            value: Number(payload.data.amount),
            unconfirmed: true,
          });
          dispatch.currentTransaction.SET_TX_ID(payload.data.txid);
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
          return;
        }
        dispatch.account.login({ data: payload.data });
        dispatch.environment.SET_LOGIN_FEEDBACK('Getting transactions...');
        const { address } = payload.data;
        sendToBitgo(BitgoAction.LIST_UNSPENT, { address });
        sendToBitgo(BitgoAction.LIST_TRANSACTIONS, { address });
        return;
      }
      // HANDLE ALL OTHER ERRORS GENERICALLY
      if (payload.error) {
        commonError();
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
    });
    return () => {
      ipcRenderer.removeAllListeners(BITGO_IPC_ID);
    };
  }, [myAddress]);

  return <div />;
};

export default BitgoOrchestrator;
