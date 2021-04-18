import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import { ButtonSmall } from 'components/_General/buttons';
import User from './User';

const TopBarRoot = styled.div`
  background-color: var(--color-almostBlack);
  /* height: 36px; */
  width: 100%;
  display: flex;
  padding: 6px 12px;
  justify-content: flex-end;
  align-items: center;
  z-index: 100;
`;

const Spacer = styled.div`
  width: 12px;
`;

const TopBar = (): ReactElement => {
  return (
    <TopBarRoot>
      <ButtonSmall onClick={() => alert('submit feedback')}>Feedback</ButtonSmall>
      <Spacer />
      <User />
    </TopBarRoot>
  );
};

export default TopBar;
