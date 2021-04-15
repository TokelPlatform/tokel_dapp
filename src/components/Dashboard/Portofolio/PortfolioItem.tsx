import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import icons from 'assets/icons';

import ProgressBar from 'components/_General/ProgressBar';

const Container = styled.div`
  background-color: var(--color-almostBlack);
  height: 92px;
  // width: 100%;
  color: var(--color-white);
  display: flex;
  flex-direction: row;
  padding-top: 22px;
  padding-left: 30px;
`;

const Amount = styled.p`
  color: var(--color-gray);
  margin: 0;
`;

const Information = styled.div`
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

type PortfolioItemProps = {
  name: string;
  tickerName: string;
  amount: string;
  value: number;
};
const PortfolioItem = ({
  name,
  tickerName,
  amount,
  value,
}: PortfolioItemProps): ReactElement => (
  <Container>
    <img alt="coin-icon" src={icons.happy} />
    <Information>
      <h3 style={{ margin: 0 }}>
        {name} ({tickerName})
      </h3>
      <Amount>
        {amount} {tickerName} ≈ {value * parseFloat(amount)}{' '}
      </Amount>
      <ProgressBar percentage="100" length={` ${100 * (150 / 100)}`} />
    </Information>
  </Container>
);

export default PortfolioItem;
