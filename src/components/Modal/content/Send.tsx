import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';
import moment from 'moment';

import { dispatch } from 'store/rematch';
import { selectAccountAddress, selectChosenAsset } from 'store/selectors';
import { spendSuccess } from 'util/transactionsHelper';
import { SPEND, messageTypes } from 'util/workerHelper';
import { BITGO, ErrorMessages, FEE, TICKER } from 'vars/defines';

import SendForm from 'components/Dashboard/widgets/Wallet/SendForm';
import TxConfirmation from 'components/Dashboard/widgets/Wallet/TxConfirmation';

const SendRoot = styled.div`
  display: flex;
  flex-direction: column;
`;

const Send = () => {
  const [confirmation, setConfirmation] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [amountToSend, setAmountToSend] = useState(null);
  const chosenAsset = useSelector(selectChosenAsset);
  const myaddress = useSelector(selectAccountAddress);
  const [txId, setTxid] = useState(null);
  const [txStatus, setTxStatus] = useState(null);
  const [txError, setTxError] = useState(null);

  useEffect(() => {
    ipcRenderer.on(BITGO, (_, payload) => {
      if (payload.type === messageTypes.spend) {
        if (payload.error) {
          setTxStatus(-1);
          setTxError(ErrorMessages.NETWORK_ISSUES);
          return;
        }
        const success = spendSuccess(payload.data);
        setTxStatus(success);
        if (success) {
          dispatch.account.ADD_NEW_TX({
            tx: payload.data.txid,
            recipient,
            from: [myaddress],
            time: moment().format('DD/MM/YYYY H:mm:ss'),
            value: amountToSend,
            unconfirmed: true,
          });
          const updatedAsset = {
            name: TICKER,
            balance: -amountToSend - FEE,
          };
          setTxid(payload.data.txid);
          dispatch.wallet.UPDATE_ASSET_BALANCE(updatedAsset);
        }
      }
    });
  }, []);

  const handleSubmit = (address, amount) => {
    setRecipient(address);
    setAmountToSend(amount);
    setConfirmation(true);
    // dispatch.wallet.spend({ address, amount });
    setTxStatus(0);
    try {
      ipcRenderer.send(BITGO, SPEND(address, amount));
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <SendRoot>
      {!confirmation && <SendForm onSubmit={(arg1, arg2) => handleSubmit(arg1, arg2)} />}
      {confirmation && (
        <TxConfirmation
          currency={chosenAsset}
          recipient={recipient}
          amount={amountToSend}
          txId={txId}
          txStatus={txStatus}
          txError={txError}
          from={myaddress}
        />
      )}
    </SendRoot>
  );
};

export default Send;
