import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectAssets, selectChosenAsset } from 'store/selectors';
import { formatFiat } from 'util/helpers';

import { WidgetContainer } from '../widgets/common';
import PortfolioItem from './PortfolioItem';

const PortfolioRoot = styled(WidgetContainer)`
  padding: 0;
  height: 100%;
  width: 280px;
  color: var(--color-white);
  overflow-y: scroll;
`;

const Portfolio = (): ReactElement => {
  const chosenAsset = useSelector(selectChosenAsset);
  const assets = useSelector(selectAssets);
  const headerName = 'Total Holdings';
  const totalValue = formatFiat(
    assets.reduce((total, { balance, usd_value }) => total + balance * usd_value, 0)
  );

  return (
    <PortfolioRoot>
      <PortfolioItem
        header
        name={headerName}
        subtitle={`${assets.length} assets ≈ $${totalValue}`}
        selected={!chosenAsset}
        onClick={() => dispatch.wallet.SET_CHOSEN_ASSET(null)}
      />
      {assets.map(asset => (
        <PortfolioItem
          key={asset.name}
          name={`${asset.name} (${asset.ticker})`}
          subtitle={`${asset.balance} ≈ $${formatFiat(asset.balance * asset.usd_value)}`}
          percentage={100}
          selected={asset.name === chosenAsset}
          onClick={() => dispatch.wallet.SET_CHOSEN_ASSET(asset.ticker)}
        />
      ))}
    </PortfolioRoot>
  );
};

export default Portfolio;
