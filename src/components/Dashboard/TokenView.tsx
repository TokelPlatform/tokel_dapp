import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectCurrentTokenInfo, selectTransactions } from 'store/selectors';

import ActivityList from './widgets/Embeds/ActivityList';
import ActivityListEmbed from './widgets/Embeds/ActivityListEmbed';
import TokenHistoryEmbed from './widgets/Embeds/TokenHistoryEmbed';
import TransferEmbed from './widgets/Embeds/TransferEmbed';
import StandardWidget from './widgets/StandardWidget';
import TokenDetailWidget from './widgets/TokenDetailWidget';

const TokenViewRoot = styled.div`
  flex: 1;
  height: 100%;
  margin-left: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-gap: 20px;
  overflow-y: auto;
`;

const TokenView = (): ReactElement => {
  const tokenInfo = useSelector(selectCurrentTokenInfo);
  const isNFT = tokenInfo.supply === 1;
  const txs = useSelector(selectTransactions);

  return (
    <TokenViewRoot>
      <TokenDetailWidget />
      <StandardWidget title="Transfers">
        <TransferEmbed />
      </StandardWidget>
      <StandardWidget title={isNFT ? 'History' : 'Activity'}>
        {isNFT ? <TokenHistoryEmbed /> : <ActivityList transactions={txs} fullView />}
      </StandardWidget>
    </TokenViewRoot>
  );
};
export default TokenView;
