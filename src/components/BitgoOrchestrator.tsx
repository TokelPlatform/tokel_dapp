import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ipcRenderer } from 'electron';
import moment from 'moment';

import { dispatch } from 'store/rematch';
import { selectAccountAddress } from 'store/selectors';
import { parseUnspent } from 'util/transactions';
import { spendSuccess } from 'util/transactionsHelper';
import { LIST_TXS, LIST_UNSPENT, messageTypes } from 'util/workerHelper';
import { BITGO, ErrorMessages, FEE, TICKER } from 'vars/defines';

const BitgoOrchestrator = () => {
  const myaddress = useSelector(selectAccountAddress);

  useEffect(() => {
    ipcRenderer.on(BITGO, (_, payload) => {
      console.group('BITGO ORCHESTRATOR ON');
      console.log(payload);
      console.groupEnd();
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
            tx: payload.data.txid,
            recipient: payload.data.address,
            from: [myaddress],
            time: moment().format('DD/MM/YYYY H:mm:ss'),
            value: Number(payload.data.amount),
            unconfirmed: true,
          });
          console.log();
          const updatedAsset = {
            name: TICKER,
            balance: -Number(payload.data.amount) - FEE,
          };
          dispatch.currentTransaction.SET_TX_ID(payload.data.txid);
          dispatch.wallet.UPDATE_ASSET_BALANCE(updatedAsset);
        }
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
        ipcRenderer.send(BITGO, LIST_UNSPENT(payload.data.address));
        ipcRenderer.send(BITGO, LIST_TXS(payload.data.address));
      }
      // LIST UNSPENT
      if (payload.type === messageTypes.listUnspent) {
        dispatch.wallet.SET_ASSETS(parseUnspent(payload.data.balance));
        dispatch.account.SET_UNSPENT(payload.data);
      }
      // LISTTRANSACTIONS
      if (payload.type === messageTypes.listtransactions) {
        dispatch.account.SET_TXS(payload.data.txs);
      }
    });
    return () => {
      ipcRenderer.removeAllListeners(BITGO);
    };
  }, []);

  return <div />;
};

export default BitgoOrchestrator;
