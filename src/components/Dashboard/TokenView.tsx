import React, { ReactElement } from 'react';
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
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-gap: 20px;
  overflow-y: auto;
`;

const fauxNFTTxs = [
  {
    value: 1,
    from: ['SDJNS8xJ7Ya9hferR3ibtQDJHBFCXY4CSJE'],
    timestamp: 1632906379,
    txid: '4d64ba9dac684a89495ce1071fcb28f0552b209c06f54bfc1a61ffaf2b608f80',
    received: true,
  },
  {
    value: 1,
    from: ['MMKLW8xJ7YsjndjssdibtQDJHBFCXY4CSJE'],
    timestamp: 1632899732,
    txid: '6079c60335b50e2330bf53c2ee59b95e2c1ab36b040d31f02c1ddd00dad51e66',
    received: false,
  },
  {
    value: 1,
    from: ['MMKLW8xJ7YsjndjssdibtQDJHBFCXY4CSJE'],
    timestamp: 1632899732,
    txid: '6079c60335b50e2330bf53c2ee59b95e2c1ab36b040d31f02c1ddd00dad51e66',
    received: false,
  },
  {
    value: 1,
    from: ['MMKLW8xJ7YsjndjssdibtQDJHBFCXY4CSJE'],
    timestamp: 1632899732,
    txid: '6079c60335b50e2330bf53c2ee59b95e2c1ab36b040d31f02c1ddd00dad51e66',
    received: false,
  },
  {
    value: 1,
    from: ['MMKLW8xJ7YsjndjssdibtQDJHBFCXY4CSJE'],
    timestamp: 1632899732,
    txid: '6079c60335b50e2330bf53c2ee59b95e2c1ab36b040d31f02c1ddd00dad51e66',
    received: false,
  },
  {
    value: 1,
    from: ['RAAF8xJ7Ya9hferR3ibtQDJHBFCXY4CSJE'],
    timestamp: 1632899732,
    txid: '6079c60335b50e2330bf53c2ee59b95e2c1ab36b040d31f02c1ddd00dad51e66',
    received: false,
  },
  {
    value: 1,
    from: null,
    timestamp: 1631345368,
    txid: '69449770e102a1e1fd907900034f47146cbbf3a682a24fa7b088b9e408e951b9',
    received: true,
  },
];

const TokenView = (): ReactElement => {
  const tokenInfo = useSelector(selectCurrentTokenDetail);
  const isNFT = tokenInfo?.supply === 1;

  return (
    <TokenViewRoot>
      <TokenDetailWidget />
      <StandardWidget title="Transfers" width={1}>
        <TransferEmbed />
      </StandardWidget>
      <StandardWidget title={isNFT ? 'History' : 'Activity'} width={3}>
        <ActivityListEmbed
          transactions={fauxNFTTxs}
          resourceType={isNFT ? ResourceType.NFT : ResourceType.FST}
        />
      </StandardWidget>
    </TokenViewRoot>
  );
};
export default TokenView;
