import React, { ReactElement, useEffect } from 'react';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { listTransactions } from 'util/nspvlib';

import AssetView from './AssetView';
import Portfolio from './Portfolio/Portfolio';

const DashboardRoot = styled.div`
  display: flex;
  height: 100%;
  background-color: var(--color-black);
  /* width: 100%; */
`;

const HALFMINUTE = 30000;

const Dashboard = (): ReactElement => {
  useEffect(() => {
    setInterval(async () => {
      const txs = await listTransactions();
      dispatch.account.SET_TXS(txs.txids);
    }, HALFMINUTE);
  }, []);

  return (
    <DashboardRoot>
      <Portfolio />
      <AssetView />
    </DashboardRoot>
  );
};

export default Dashboard;
