import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import PortfolioItem from './Portofolio/PortoflioItem';

const Container = styled.div`
  position: absolute;
  background-color: var(--color-almostBlack);
  left: 120px;
  top: 62px;
  height: 616px;
  width: 280px;
  color: var(--color-white);
  border-radius: 4;
`;

type PortfolioProps = {
  address: string;
  balance: string;
};

const Portfolio = ({ address, balance }: PortfolioProps): ReactElement => {
  return (
    <Container>
      <PortfolioItem
        amount={balance}
        value={1.5}
        address={address}
        header
        selected
      />
      <PortfolioItem
        name="Komodo"
        tickerName="KMD"
        amount={balance}
        value={1.5}
        address={address}
        header={false}
        selected={false}
      />
    </Container>
  );
};

export default Portfolio;
