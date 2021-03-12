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

type PortfolioProps = {
  address: string;
  balance: string;
};

const Portfolio = ({ address, balance }: PortfolioProps): ReactElement => {
  return (
    <Container>
      <h1>{address}</h1>
      <h1>{balance}</h1>
    </Container>
  );
};

export default Portfolio;
