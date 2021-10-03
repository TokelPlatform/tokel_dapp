import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import axios from 'axios';

import { dispatch } from 'store/rematch';
import {
  selectChosenToken,
  selectCurrentAsset,
  selectTokelPriceUSD,
  selectTokenCount,
  selectUnspentBalance,
} from 'store/selectors';
import { V } from 'util/theming';
import { TOKEL_PRICE_UPDATE_PERIOD_MS, TOKEL_PRICE_URL } from 'vars/defines';

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

const fetchTokelPrice = async () => {
  try {
    const priceJson = await axios(TOKEL_PRICE_URL);
    dispatch.environment.SET_TOKEL_PRICE_USD(priceJson.data?.quotes?.USD?.price);
  } catch (e) {
    console.log(e);
  }
};

const Portfolio = (): ReactElement => {
  const currentAsset = useSelector(selectCurrentAsset);
  const balance = useSelector(selectUnspentBalance);
  const chosenToken = useSelector(selectChosenToken);
  const tokenCount = useSelector(selectTokenCount);

  const tokelPriceUSD = useSelector(selectTokelPriceUSD);
  const priceString = tokelPriceUSD
    ? ` ~ $${Math.round(balance * tokelPriceUSD * 100) / 100}`
    : null;

  useEffect(() => {
    fetchTokelPrice();
    const priceClock = setInterval(fetchTokelPrice, TOKEL_PRICE_UPDATE_PERIOD_MS);
    return () => {
      clearInterval(priceClock);
    };
  }, []);

  return (
    <PortfolioRoot>
      {currentAsset && (
        <PortfolioItem
          key={currentAsset.name}
          name={`${balance} ${currentAsset.ticker}${priceString}`}
          subtitle={`${tokenCount} tokens`}
          selected={!chosenToken}
          onClick={() => dispatch.wallet.SET_CHOSEN_TOKEN(null)}
          icon
        />
      )}
      <Tokens />
    </PortfolioRoot>
  );
};

export default Portfolio;
