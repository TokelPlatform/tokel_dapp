import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectParsedTransactions } from 'store/selectors';

import { WidgetContainer, WidgetTitle } from '../common';
import ActivityList from './ActivityList';

const ActivityTableRoot = styled(WidgetContainer)`
  grid-column: span 3;
`;

const ActivityTitle = styled(WidgetTitle)`
  border-bottom: var(--border-dark);
`;

const ActivityTable = (): ReactElement => {
  const txs = useSelector(selectParsedTransactions);

  return (
    <ActivityTableRoot>
      <ActivityTitle>Recent Activity</ActivityTitle>
      <ActivityList fullView={false} transactions={txs} />
    </ActivityTableRoot>
  );
};

export default ActivityTable;
