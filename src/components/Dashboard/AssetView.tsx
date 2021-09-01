import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectCurrentAsset } from 'store/selectors';

import LineGraph from './widgets/LineGraph';
import Wallet from './widgets/Wallet/Wallet';

const AssetViewRoot = styled.div`
  flex: 1;
  height: 100%;
  margin-left: 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 20px;
  overflow-y: auto;
`;

const AssetView = (): ReactElement => {
  const currentAsset = useSelector(selectCurrentAsset);

  return (
    <AssetViewRoot>
      <LineGraph />
      {currentAsset && <Wallet asset={currentAsset} />}
    </AssetViewRoot>
  );
};
export default AssetView;
