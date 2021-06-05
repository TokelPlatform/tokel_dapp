import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import receiveIcon from 'assets/receiveIcon.svg';
import withdrawIcon from 'assets/withdrawIcon.svg';
import { dispatch } from 'store/rematch';
import { formatDec } from 'util/helpers';
import { TxType } from 'util/nspvlib-mock';
import { Colors, ModalName, TICKER } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import InfoNote from 'components/_General/InfoNote';

const ActivityListRoot = styled.div`
  grid-column: span 3;
`;

type TransactionsProps = {
  fullView: boolean;
};

const Transactions = styled.div<TransactionsProps>`
  display: grid;
  grid-template-columns: ${props => {
    return props.fullView ? '20% 15% 20% 25% 20%' : '40% 20% 40%';
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
  padding: 20px 0 8px 0;
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
  margin-top: -1px;
  border-top: var(--border-dark);
  padding-bottom: 10px;
`;

type ActivityListProps = {
  transactions: Array<TxType>;
  fullView?: boolean;
};

const handleTxDetailView = tx => {
  dispatch.account.SET_CHOSEN_TX(tx);
  dispatch.environment.SET_MODAL(ModalName.TX_DETAIL);
};

const ActivityList = ({ transactions = [], fullView }: ActivityListProps): ReactElement => {
  return (
    <ActivityListRoot>
      {transactions.length === 0 && <InfoNote title="No data available" />}
      {transactions.map(tx => (
        <TransactionWrapper key={tx.txid + tx.received}>
          <Transactions fullView={fullView}>
            <Column>
              <p style={{ width: '40px', margin: 0 }} className="datetime">
                {tx.time ? tx.time : 'N/A'}
              </p>
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
                {` ${tx.received ? '+' : '-'}${formatDec(tx.value)} ${TICKER}`}
              </p>
              <p className="additionalInfo" style={{ textAlign: 'right' }}>
                $TBA
              </p>
              {/*
              https://github.com/TokelPlatform/tokel_app/issues/67
              <p className="additionalInfo" style={{ textAlign: 'right' }}>
                ${formatFiat(tx.value * USD_VALUE)}
              </p> */}
            </Column>
            {fullView && (
              <Column style={{ justifySelf: 'flex-end' }}>
                <Button
                  onClick={() => handleTxDetailView(tx)}
                  customWidth="86px"
                  theme={Colors.BLACK}
                >
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
