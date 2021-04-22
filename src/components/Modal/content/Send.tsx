import React from 'react';

import styled from '@emotion/styled';

import SendForm from 'components/Dashboard/widgets/Wallet/SendForm';

const SendRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
`;

const Send = () => {
  return (
    <SendRoot>
      <SendForm />
    </SendRoot>
  );
};

export default Send;
