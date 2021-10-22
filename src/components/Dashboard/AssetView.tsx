import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectTransactions, selectUnspentBalance } from 'store/selectors';
import { ResourceType } from 'vars/defines';

import ActivityListEmbed from './widgets/Embeds/ActivityListEmbed';
import TransferEmbed from './widgets/Embeds/TransferEmbed';
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
  const balance = useSelector(selectUnspentBalance);
  const holdings = [
    { label: 'Unlocked', value: balance },
    { label: 'Locked', value: balance },
    { label: 'Total', value: balance },
  ];

  return (
    <AssetViewRoot>
      <LineGraph />
      <StandardWidget title="Transfer">
        <TransferEmbed holdingSections={holdings} />
      </StandardWidget>
      <StandardWidget title="History" width={3}>
        <ActivityListEmbed transactions={txs} resourceType={ResourceType.TOKEL} />
      </StandardWidget>
    </AssetViewRoot>
  );
};
export default AssetView;
