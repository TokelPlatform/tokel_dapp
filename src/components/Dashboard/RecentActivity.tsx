import React, { ReactElement } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  position: absolute;
  background-color: var(--color-almostBlack);
  left: 416px;
  top: 366px;
  height: 312px;
  width: 464px;
`;

type RecentActivityProps = {
  utxos: Record<string, unknown>[];
};

const RecentActivity = ({ utxos }: RecentActivityProps): ReactElement => {
  return <Container>{utxos}</Container>;
};

export default RecentActivity;
