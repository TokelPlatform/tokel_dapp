import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectChosenAsset } from 'store/selectors';

import { WidgetContainer } from '../widgets/common';
import PortfolioItem from './PortfolioItem';

const PortfolioRoot = styled(WidgetContainer)`
  padding: 0;
  height: 100%;
  width: 280px;
  color: var(--color-white);
  overflow-y: scroll;
`;

const assets = [
  {
    name: 'Tokel',
    ticker: 'TKL',
    balance: 10,
    usd_value: 1.12,
  },
  {
    name: 'Komodo',
    ticker: 'KMD',
    balance: 100,
    usd_value: 3.12,
  },
];

const totalValue = assets.reduce((total, { balance, usd_value }) => total + balance * usd_value, 0);

const Portfolio = (): ReactElement => {
  const chosenAsset = useSelector(selectChosenAsset);
  const setChosenAsset = name => dispatch.wallet.SET_CHOSEN_ASSET(name);
  const headerName = 'Total Holdings';

  return (
    <PortfolioRoot>
      <PortfolioItem
        header
        name={headerName}
        subtitle={`${assets.length} assets ≈ $${totalValue}`}
        selected={chosenAsset === headerName}
        onClick={() => setChosenAsset(headerName)}
      />
      {assets.map(asset => (
        <PortfolioItem
          key={asset.name}
          name={`${asset.name} (${asset.ticker})`}
          subtitle={`${asset.balance} ≈ $${asset.balance * asset.usd_value}`}
          percentage={40}
          selected={asset.name === chosenAsset}
          onClick={() => setChosenAsset(asset.name)}
        />
      ))}
    </PortfolioRoot>
  );
};

export default Portfolio;
