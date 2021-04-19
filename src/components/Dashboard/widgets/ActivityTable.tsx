import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectUnspentUtxos } from 'store/selectors';
import { dashboardPanels } from 'vars/styles/styles';

import { WidgetContainer, WidgetTitle } from './common';

const ActivityTableRoot = styled(WidgetContainer)`
  grid-column: span 3;
  ${dashboardPanels}
`;

const ActivityTable = (): ReactElement => {
  const utxos = useSelector(selectUnspentUtxos);

  return (
    <ActivityTableRoot>
      <WidgetTitle>Recent Activity</WidgetTitle>
      {utxos.map(tx => (
        <p key={tx.txid}>Txid {tx.txid}</p>
      ))}
    </ActivityTableRoot>
  );
};

export default ActivityTable;
