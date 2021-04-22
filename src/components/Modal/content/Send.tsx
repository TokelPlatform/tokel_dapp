import React, { useState } from 'react';

import styled from '@emotion/styled';

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

  return (
    <SendRoot>
      {!confirmation && <SendForm onSubmit={() => setConfirmation(true)} />}
      {confirmation && <TxConfirmation />}
    </SendRoot>
  );
};

export default Send;
