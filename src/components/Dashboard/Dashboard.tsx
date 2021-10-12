import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectChosenToken, selectKey } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { V } from 'util/theming';

import AssetView from './AssetView';
import Portfolio from './Portfolio/Portfolio';
import TokenView from './TokenView';

const DashboardRoot = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex: 1;
  background-color: ${V.color.backHard};
  padding: 18px;
  margin: 0;
`;

const TX_FETCH_INTERVAL_MS = 30 * 1000;

const Dashboard = (): ReactElement => {
  const key = useSelector(selectKey);
  const chosenToken = useSelector(selectChosenToken);

  useEffect(() => {
    const txInterval = setInterval(() => {
      sendToBitgo(BitgoAction.LOGIN, { key });
    }, TX_FETCH_INTERVAL_MS);
    return () => {
      clearInterval(txInterval);
    };
  }, [key]);

  return (
    <DashboardRoot>
      <Portfolio />
      {chosenToken ? <TokenView /> : <AssetView />}
    </DashboardRoot>
  );
};

export default Dashboard;
