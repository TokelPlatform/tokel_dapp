import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectChosenToken, selectCurrentAsset, selectUnspentBalance } from 'store/selectors';
import { V } from 'util/theming';

import { WidgetContainer } from '../widgets/common';
import PortfolioItem from './PortfolioItem';
import Tokens from './Tokens';

const PortfolioRoot = styled(WidgetContainer)`
  height: 100%;
  width: 280px;
  display: flex;
  flex-direction: column;
  padding: 0;
  color: ${V.color.front};
`;

const Portfolio = (): ReactElement => {
  const currentAsset = useSelector(selectCurrentAsset);
  const balance = useSelector(selectUnspentBalance);
  const chosenToken = useSelector(selectChosenToken);

  return (
    <PortfolioRoot>
      {currentAsset && (
        <PortfolioItem
          key={currentAsset.name}
          name={`${balance} ${currentAsset.ticker}`}
          subtitle="big fat nuthin"
          selected={!chosenToken}
          onClick={() => dispatch.wallet.SET_CHOSEN_TOKEN(null)}
        />
      )}
      <Tokens />
    </PortfolioRoot>
  );
};

export default Portfolio;
