import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import AssetView from './AssetView';
import Portfolio from './Portfolio/Portfolio';

const DashboardRoot = styled.div`
  display: flex;
  height: 100%;
  background-color: var(--color-black);
  /* width: 100%; */
`;

const Dashboard = (): ReactElement => (
  <DashboardRoot>
    <Portfolio />
    <AssetView />
  </DashboardRoot>
);

export default Dashboard;
