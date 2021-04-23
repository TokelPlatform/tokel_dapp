import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectUnspentUtxos } from 'store/selectors';

import { WidgetContainer, WidgetTitle } from '../common';
import ActivityList from './ActivityList';

const ActivityTableRoot = styled(WidgetContainer)`
  grid-column: span 3;
`;

const ActivityTitle = styled(WidgetTitle)`
  border-bottom: var(--border-dark);
`;

const ActivityTable = (): ReactElement => {
  const utxos = useSelector(selectUnspentUtxos);

  return (
    <ActivityTableRoot>
      <ActivityTitle>Recent Activity</ActivityTitle>
      <ActivityList transactions={utxos} />
    </ActivityTableRoot>
  );
};

export default ActivityTable;
