import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import { formatDec, formatFiat } from 'util/helpers';
import { TxType } from 'util/nspvlib-mock';

import InfoNote from 'components/_General/InfoNote';

const chosenAsset = {
  name: 'TKLTEST',
  usd_value: 3.5,
};

const ActivityListRoot = styled.div`
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
  border-top: var(--border-dark);
`;

type ActivityListProps = {
  transactions: Array<TxType>;
};

const ActivityList = ({ transactions = [] }: ActivityListProps): ReactElement => {
  return (
    <ActivityListRoot>
      {transactions.length === 0 && <InfoNote title="No data available" />}
      {transactions.map(tx => (
        <TransactionWrapper key={tx.txid}>
          <Transactions>
            <Column>
              <p className="datetime">{tx.height}</p>
            </Column>
            <Column>
              <p className="info">{tx.received ? 'Received' : 'Sent'}</p>
              <p className="additionalInfo">{tx.received ? 'Deposit' : 'Withdrawal'}</p>
            </Column>
            <Column>
              <p className="info" style={{ textAlign: 'right' }}>
                {(tx.received ? '+' : '-').concat(formatDec(tx.value))} {chosenAsset.name}
              </p>
              <p className="additionalInfo" style={{ textAlign: 'right' }}>
                ${formatFiat(tx.value * chosenAsset.usd_value)}
              </p>
            </Column>
          </Transactions>
        </TransactionWrapper>
      ))}
    </ActivityListRoot>
  );
};

export default ActivityList;
