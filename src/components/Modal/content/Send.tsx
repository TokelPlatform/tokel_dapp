import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';

import { dispatch } from 'store/rematch';
import {
  selectAccountAddress,
  selectChosenAsset,
  selectCurrentTxError,
  selectCurrentTxId,
  selectCurrentTxStatus,
} from 'store/selectors';
import { spend } from 'util/workerHelper';
import { BITGO } from 'vars/defines';

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
  const currentTxId = useSelector(selectCurrentTxId);
  const currentTxErorr = useSelector(selectCurrentTxError);
  const currentTxStatus = useSelector(selectCurrentTxStatus);

  const handleSubmit = (address, amount) => {
    dispatch.currentTransaction.RESET_TX();

    setRecipient(address);
    setAmountToSend(amount);
    setConfirmation(true);
    try {
      ipcRenderer.send(BITGO, spend(address, amount));
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
          txId={currentTxId}
          txStatus={currentTxStatus}
          txError={currentTxErorr}
          from={myaddress}
        />
      )}
    </SendRoot>
  );
};

export default Send;
