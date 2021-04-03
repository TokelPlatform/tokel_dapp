import React, { ReactElement } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  position: absolute;
  background-color: var(--color-almostBlack);
  left: 416px;
  top: 62px;
  height: 288px;
  width: 800px;
  border-radius: 4;
`;

const PortfolioValueGraph = (): ReactElement => {
  return <Container />;
};

export default PortfolioValueGraph;
