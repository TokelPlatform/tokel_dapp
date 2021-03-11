import React, { ReactElement } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  position: absolute;
  background-color: var(--color-almostBlack);
  left: 120px;
  top: 62px;
  height: 616px;
  width: 280px;
`;

const Portfolio = (): ReactElement => {
  return <Container />;
};

export default Portfolio;
