import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectChosenAsset } from 'store/selectors';

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

  const handleSubmit = (address, amount) => {
    setRecipient(address);
    setAmountToSend(amount);
    setConfirmation(true);
    dispatch.wallet.spend({ address, amount });
  };
  return (
    <SendRoot>
      {!confirmation && <SendForm onSubmit={(arg1, arg2) => handleSubmit(arg1, arg2)} />}
      {confirmation && (
        <TxConfirmation currency={chosenAsset} recipient={recipient} amount={amountToSend} />
      )}
    </SendRoot>
  );
};

export default Send;
