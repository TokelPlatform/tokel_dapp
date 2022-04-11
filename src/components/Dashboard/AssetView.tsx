import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectTransactions, selectUnspentBalance } from 'store/selectors';
import { processPossibleBN } from 'util/helpers';
import { ResourceType, TICKER } from 'vars/defines';

import ActivityListEmbed from './widgets/Embeds/ActivityListEmbed';
import TransferEmbed, { HoldingType } from './widgets/Embeds/TransferEmbed';
import WalletAddressesEmbed from './widgets/Embeds/WalletAddressesEmbed';
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
  const holdings: Array<HoldingType> = [
    // { label: 'Unlocked', value: balance },
    // { label: 'Locked', value: balance },
    { label: 'Total', value: `${processPossibleBN(balance)} ${TICKER}` },
  ];

  return (
    <AssetViewRoot>
      <StandardWidget title="History" width={5}>
        <ActivityListEmbed transactions={txs} resourceType={ResourceType.TOKEL} />
      </StandardWidget>
      <StandardWidget title="Transfer" width={3}>
        <TransferEmbed holdingSections={holdings} />
      </StandardWidget>
      <StandardWidget title="Wallet Addresses" width={2}>
        <WalletAddressesEmbed />
      </StandardWidget>
    </AssetViewRoot>
  );
};
export default AssetView;
