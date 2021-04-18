import React from 'react';

import styled from '@emotion/styled';

import happyIcon from 'assets/happy.svg';

const UserRoot = styled.div``;

const UserButton = styled.button`
  background: none;
  border: 1px solid var(--color-almostBlack);
  height: 32px;
  width: 32px;
`;

const User = () => (
  <UserRoot>
    <UserButton>
      <img alt="user-profile" src={happyIcon} style={{ height: '100%', width: '100%' }} />
    </UserButton>
  </UserRoot>
);

export default User;
