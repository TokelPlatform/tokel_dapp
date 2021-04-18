import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import ActivityTable from './widgets/ActivityTable';
import LineGraph from './widgets/LineGraph';
import PieChart from './widgets/PieChart';

const AssetViewRoot = styled.div`
  flex: 1;
  margin: 0 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 20px;
  overflow-y: scroll;
`;

const AssetView = (): ReactElement => (
  <AssetViewRoot>
    <LineGraph />
    <ActivityTable />
    <PieChart />
  </AssetViewRoot>
);

export default AssetView;
