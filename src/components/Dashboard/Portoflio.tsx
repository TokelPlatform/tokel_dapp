import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import PortfolioItem from './Portofolio/PortoflioItem';
import Header from './Portofolio/Header';

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
  console.log(address);
  return (
    <Container>
      <Header amount={balance} value={1.5} address={address} />
      <PortfolioItem
        name="Komodo"
        tickerName="KMD"
        amount={balance}
        value={1.5}
      />
    </Container>
  );
};

export default Portfolio;
