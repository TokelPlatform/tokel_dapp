import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectAssets, selectChosenAsset } from 'store/selectors';

import ActivityTable from './widgets/Activity/ActivityTable';
import LineGraph from './widgets/LineGraph';
import PieChart from './widgets/PieChart';
import Wallet from './widgets/Wallet';

const AssetViewRoot = styled.div`
  flex: 1;
  margin: 0 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 20px;
  overflow-y: scroll;
`;

const AssetView = (): ReactElement => {
  const chosenAsset = useSelector(selectChosenAsset);
  const theAsset = useSelector(selectAssets).find(item => item.name === chosenAsset);
  return (
    <AssetViewRoot>
      <LineGraph />
      {!chosenAsset && <ActivityTable />}
      {!chosenAsset && <PieChart />}
      {chosenAsset && <Wallet asset={theAsset} />}
    </AssetViewRoot>
  );
};
export default AssetView;
