import React, { useState } from 'react';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';

import SendForm from 'components/Dashboard/widgets/Wallet/SendForm';
import TxConfirmation from 'components/Dashboard/widgets/Wallet/TxConfirmation';

const SendRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
`;

const Send = () => {
  const [confirmation, setConfirmation] = useState(false);

  const handleSubmit = (address, amount) => {
    dispatch.wallet.spend({ address, amount });
    setConfirmation(true);
  };
  return (
    <SendRoot>
      {!confirmation && <SendForm onSubmit={(arg1, arg2) => handleSubmit(arg1, arg2)} />}
      {confirmation && <TxConfirmation />}
    </SendRoot>
  );
};

export default Send;
