import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import receiveIcon from 'assets/receiveIcon.svg';
import withdrawIcon from 'assets/withdrawIcon.svg';
import { formatDec, formatFiat } from 'util/helpers';
import { TxType } from 'util/nspvlib-mock';
import { Colors } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import InfoNote from 'components/_General/InfoNote';

const chosenAsset = {
  name: 'TKLTEST',
  usd_value: 3.5,
};

const ActivityListRoot = styled.div`
  grid-column: span 3;
`;

type TransactionsProps = {
  fullView: boolean;
};

const Transactions = styled.div<TransactionsProps>`
  display: grid;
  grid-template-columns: ${props => {
    console.log(props.fullView);
    return props.fullView ? '20% 15% 20% 25% 20%' : '30% 30% 40%';
  }};
  padding: 0 28px;

  .datetime {
    color: var(--color-gray);
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  fullView?: boolean;
};

const ActivityList = ({ transactions = [], fullView }: ActivityListProps): ReactElement => {
  return (
    <ActivityListRoot>
      {transactions.length === 0 && <InfoNote title="No data available" />}
      {transactions.map(tx => (
        <TransactionWrapper key={tx.txid}>
          <Transactions fullView={fullView}>
            <Column>
              <p className="datetime">{tx.height}</p>
            </Column>
            {fullView && (
              <Column>
                <img alt="walletIcon" width="23px" src={tx.received ? receiveIcon : withdrawIcon} />
              </Column>
            )}
            <Column>
              <p className="info">{tx.received ? 'Received' : 'Sent'}</p>
              <p className="additionalInfo">{tx.received ? 'Deposit' : 'Withdrawal'}</p>
            </Column>
            <Column style={{ justifySelf: 'flex-end' }}>
              <p className="info" style={{ textAlign: 'right' }}>
                {(tx.received ? '+' : '-').concat(formatDec(tx.value))} {chosenAsset.name}
              </p>
              <p className="additionalInfo" style={{ textAlign: 'right' }}>
                ${formatFiat(tx.value * chosenAsset.usd_value)}
              </p>
            </Column>
            {fullView && (
              <Column style={{ justifySelf: 'flex-end' }}>
                <Button customWidth="86px" theme={Colors.BLACK}>
                  View
                </Button>
              </Column>
            )}
          </Transactions>
        </TransactionWrapper>
      ))}
    </ActivityListRoot>
  );
};
ActivityList.defaultProps = {
  fullView: false,
};
export default ActivityList;
