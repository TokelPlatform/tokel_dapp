import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectUnspentUtxos } from 'store/selectors';

import { WidgetContainer, WidgetTitle } from './common';

const chosenAsset = {
  name: 'TKLTEST',
  usd_value: 3.5,
};

const ActivityTableRoot = styled(WidgetContainer)`
  grid-column: span 3;
`;

const Transactions = styled.div`
  display: grid;
  grid-template-columns: 30% 30% 40%;
  padding: 0 28px;

  .datetime {
    color: var(--color-gray);
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0 0 0;
  .info {
    margin: 0 0 2px 0;
  }
  .additionalInfo {
    color: var(--color-gray);
    margin: 0;
    font-size: var(--font-size-additional-p);
  }
`;

const TransactionWrapper = styled.div`
  border-top: 1px solid var(--color-almostBlack2);
`;

const ActivityTable = (): ReactElement => {
  const utxos = useSelector(selectUnspentUtxos);

  return (
    <ActivityTableRoot>
      <WidgetTitle>Recent Activity</WidgetTitle>
      {utxos.map(tx => (
        <TransactionWrapper key={tx.txid}>
          <Transactions>
            <Column>
              <p className="datetime">{tx.height}</p>
            </Column>
            <Column>
              <p className="info">{tx.vout ? 'Received' : 'Sent'}</p>
              <p className="additionalInfo">{tx.vout ? 'Deposit' : 'Withdrawal'}</p>
            </Column>
            <Column>
              <p className="info" style={{ textAlign: 'right' }}>
                {tx.value.toFixed(8)} {chosenAsset.name}
              </p>
              <p className="additionalInfo" style={{ textAlign: 'right' }}>
                ${(tx.value * chosenAsset.usd_value).toFixed(8)}
              </p>
            </Column>
          </Transactions>
        </TransactionWrapper>
      ))}
    </ActivityTableRoot>
  );
};

export default ActivityTable;
