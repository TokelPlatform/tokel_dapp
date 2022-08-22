import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectCurrentTokenDetail } from 'store/selectors';
import { ResourceType } from 'vars/defines';

import ActivityListEmbed from './widgets/Embeds/ActivityListEmbed';
import TransferEmbed from './widgets/Embeds/TransferEmbed';
import StandardWidget from './widgets/StandardWidget';
import TokenDetailWidget from './widgets/TokenDetailWidget';

const TokenViewRoot = styled.div`
  flex: 1;
  height: 100%;
  margin-left: 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-gap: 20px;
  overflow-y: auto;
`;

const TokenView = (): React.ReactElement => {
  const tokenInfo = useSelector(selectCurrentTokenDetail);
  const isNFT = tokenInfo?.supply === 1;

  return (
    <TokenViewRoot>
      <TokenDetailWidget />
      <StandardWidget title="Transfers" width={2}>
        <TransferEmbed />
      </StandardWidget>
      <StandardWidget title={isNFT ? 'History' : 'Activity'} width={3}>
        <ActivityListEmbed
          transactions={[]}
          resourceType={isNFT ? ResourceType.NFT : ResourceType.FST}
        />
      </StandardWidget>
    </TokenViewRoot>
  );
};
export default TokenView;
