import React, { ReactElement } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  position: absolute;
  background-color: var(--color-almostBlack);
  left: 0;
  top: 0;
  height: 38px;
  width: 1240px;
`;

const TopBar = (): ReactElement => {
  return <Container />;
};

export default TopBar;
