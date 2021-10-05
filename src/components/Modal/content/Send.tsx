import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import {
  selectAccountAddress,
  selectChosenAsset,
  selectCurrentTxError,
  selectCurrentTxId,
  selectCurrentTxStatus,
} from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';

import SendForm from 'components/Dashboard/widgets/Wallet/SendForm';
import TxConfirmation from 'components/Dashboard/widgets/Wallet/TxConfirmation';

const SendRoot = styled.div`
  display: flex;
  flex-direction: column;
`;

const Send = () => {
  const chosenAsset = useSelector(selectChosenAsset);
  const myAddress = useSelector(selectAccountAddress);
  const currentTxId = useSelector(selectCurrentTxId);
  const currentTxErorr = useSelector(selectCurrentTxError);
  const currentTxStatus = useSelector(selectCurrentTxStatus);

  const [confirmation, setConfirmation] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [amountToSend, setAmountToSend] = useState(null);

  const handleSubmit = (address: string, amount: string) => {
    dispatch.currentTransaction.RESET_TX();

    setRecipient(address);
    setAmountToSend(amount);
    setConfirmation(true);
    try {
      sendToBitgo(BitgoAction.SPEND, { address, amount: Number(amount) });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <SendRoot>
      {!confirmation && <SendForm onSubmit={handleSubmit} />}
      {confirmation && (
        <TxConfirmation
          currency={chosenAsset}
          recipient={recipient}
          amount={amountToSend}
          txId={currentTxId}
          txStatus={currentTxStatus}
          txError={currentTxErorr}
          from={myAddress}
        />
      )}
    </SendRoot>
  );
};

export default Send;
