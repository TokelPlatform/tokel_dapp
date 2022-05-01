import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import {
  selectLockedTransactions,
  selectLockedTransactionsBalance,
  selectTransactions,
  selectUnspentBalance,
} from 'store/selectors';
import { processPossibleBN } from 'util/helpers';
import { LOCKED, ResourceType, SPENDABLE } from 'vars/defines';

import ActivityListEmbed from './widgets/Embeds/ActivityListEmbed';
import TransferEmbed, { HoldingType } from './widgets/Embeds/TransferEmbed';
import WalletAddressesEmbed from './widgets/Embeds/WalletAddressesEmbed';
import StandardWidget from './widgets/StandardWidget';

const AssetViewRoot = styled.div`
  flex: 1;
  height: 100%;
  margin-left: 20px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 15px;
  overflow-y: auto;
`;

const AssetView = (): ReactElement => {
  const txs = useSelector(selectTransactions);
  const lockedTransactions = useSelector(selectLockedTransactions);
  const lockedSum = useSelector(selectLockedTransactionsBalance);
  console.log('lockedTransactions', lockedTransactions);
  const balance = processPossibleBN(useSelector(selectUnspentBalance));
  const holdings: Array<HoldingType> = [
    {
      label: SPENDABLE,
      value: `${Number(balance) - Number(lockedSum)}`,
      icon: 'coinStack',
    },
  ];
  if (lockedTransactions?.length > 0) {
    holdings.push({
      label: LOCKED,
      value: lockedTransactions,
      icon: 'lock',
    });
  }

  return (
    <AssetViewRoot>
      <StandardWidget title="Send" width={3} height={1}>
        <TransferEmbed holdingSections={holdings} />
      </StandardWidget>
      <StandardWidget title="Receive" width={3} height={1}>
        <WalletAddressesEmbed />
      </StandardWidget>
      <StandardWidget title="Activity" width={6} height={1}>
        <ActivityListEmbed transactions={txs} resourceType={ResourceType.TOKEL} />
      </StandardWidget>
    </AssetViewRoot>
  );
};
export default AssetView;
