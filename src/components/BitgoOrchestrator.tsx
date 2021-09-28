import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ipcRenderer } from 'electron';
import moment from 'moment';

import { dispatch } from 'store/rematch';
import { selectAccountAddress } from 'store/selectors';
import { parseUnspent } from 'util/transactions';
import { spendSuccess } from 'util/transactionsHelper';
import { listTxs, listUnspent, messageTypes } from 'util/workerHelper';
import { BITGO, ErrorMessages } from 'vars/defines';

const commonError = () => {
  ipcRenderer.send('reconnect', { restart: true });
  dispatch.environment.SET_LOGIN_FEEDBACK('Trying to connect to nspv...');
  dispatch.environment.UPDATE_NSPV_STATUS(false);
};
const BitgoOrchestrator = () => {
  const myaddress = useSelector(selectAccountAddress);

  useEffect(() => {
    ipcRenderer.on(BITGO, (_, payload) => {
      console.group('BITGO ORCHESTRATOR ON');
      console.log(payload);
      console.groupEnd();

      if (payload.type === messageTypes.newaddress) {
        dispatch.account.SET_KEY(payload.data.wif);
        dispatch.account.SET_SEED(payload.data.seed);
      }

      // SPEND
      if (payload.type === messageTypes.spend) {
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
            from: [myaddress],
            time: moment().format('DD/MM/YYYY H:mm:ss'),
            value: Number(payload.data.amount),
            unconfirmed: true,
          });
          dispatch.currentTransaction.SET_TX_ID(payload.data.txid);
        }
        return;
      }
      // LOGIN
      if (payload.type === messageTypes.login) {
        if (payload.error) {
          dispatch.environment.SET_ERROR(payload.error);
          dispatch.environment.SET_LOGIN_FEEDBACK(null);
          return;
        }
        dispatch.account.login({ data: payload.data });
        dispatch.environment.SET_LOGIN_FEEDBACK('Getting transactions...');
        ipcRenderer.send(BITGO, listUnspent(payload.data.address));
        ipcRenderer.send(BITGO, listTxs(payload.data.address));
        return;
      }
      // LIST UNSPENT
      if (payload.type === messageTypes.listUnspent) {
        if (payload.error) {
          commonError();
          return;
        }
        dispatch.wallet.SET_ASSETS(parseUnspent(payload.data.balance));
        dispatch.account.SET_UNSPENT(payload.data);
        return;
      }
      // LISTTRANSACTIONS
      if (payload.type === messageTypes.listtransactions) {
        if (payload.error) {
          commonError();
          return;
        }
        dispatch.account.SET_TXS(payload.data);
      }
      // TOKEN V2 ADDRESS
      if (payload.type === messageTypes.tokenV2address) {
        if (payload.error) {
          commonError();
          return;
        }
        dispatch.account.SET_CC_DETAILS(payload.data);
      }
    });
    return () => {
      ipcRenderer.removeAllListeners(BITGO);
    };
  }, [myaddress]);

  return <div />;
};

export default BitgoOrchestrator;
