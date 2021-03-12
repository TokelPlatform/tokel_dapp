import React, { ReactElement } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  position: absolute;
  background-color: var(--color-almostBlack);
  left: 416px;
  top: 366px;
  height: 312px;
  width: 464px;
  border-radius: 4;
`;

const Heading = styled.h3`
  margin-left: 34px;
  margin-top: 26px;
  color: var(--color-white);
`;

type RecentActivityProps = {
  utxos: Record<string, unknown>[];
};

const RecentActivity = ({ utxos }: RecentActivityProps): ReactElement => {
  console.log(utxos);
  return (
    <Container>
      <Heading>Recent Activity</Heading>
      {/* {utxos && utxos.map(tx => {
      return <p key={tx.txid}>Txid {tx.txid}</p>
    })} */}
    </Container>
  );
};

export default RecentActivity;
