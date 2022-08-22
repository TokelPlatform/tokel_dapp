import React from 'react';

import styled from '@emotion/styled';

import PrivateKeyForm from './PrivateKeyForm';

const PrivKeyLoginRoot = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
  flex: 1;
`;

const PrivKeyLogin = () => {
  return (
    <PrivKeyLoginRoot>
      <PrivateKeyForm />
    </PrivKeyLoginRoot>
  );
};

export default PrivKeyLogin;
