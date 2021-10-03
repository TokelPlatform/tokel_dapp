import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectTransactions } from 'store/selectors';

import ActivityListEmbed from './widgets/Embeds/ActivityListEmbed';
import LineGraph from './widgets/LineGraph';
import StandardWidget from './widgets/StandardWidget';

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
  const txs = useSelector(selectTransactions);

  return (
    <AssetViewRoot>
      <LineGraph />
      <StandardWidget title="Transfers">
        <div>transfers</div>
      </StandardWidget>
      <StandardWidget title="History">
        <ActivityListEmbed transactions={txs} />
      </StandardWidget>
    </AssetViewRoot>
  );
};
export default AssetView;
