import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectUnspentBalance } from 'store/selectors';

import PortfolioItem from './PortfolioItem';

const PortfolioRoot = styled.div`
  background-color: var(--color-almostBlack);
  height: 100%;
  width: 280px;
  color: var(--color-white);
  border-radius: var(--border-radius-big);
  overflow-y: scroll;
`;

const assets = [
  {
    name: 'Komodo',
    ticker: 'KMD',
    balance: 100,
    usd_value: 3.12,
  },
];

const totalValue = assets.reduce((total, { balance, usd_value }) => total + balance * usd_value, 0);

const Portfolio = (): ReactElement => {
  const balance = useSelector(selectUnspentBalance);
  console.log(balance);

  return (
    <PortfolioRoot>
      <PortfolioItem name="Total Holdings" subtitle={`${assets.length} assets ≈ $${totalValue}`} />
      {assets.map(asset => (
        <PortfolioItem
          key={asset.name}
          name={`${asset.name} (${asset.ticker})`}
          subtitle={`${asset.balance} ≈ $${asset.balance * asset.usd_value}`}
          percentage={40}
        />
      ))}
    </PortfolioRoot>
  );
};

export default Portfolio;
