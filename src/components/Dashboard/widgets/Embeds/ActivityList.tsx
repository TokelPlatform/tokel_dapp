import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import checkIcon from 'assets/Check.svg';
import clockIcon from 'assets/Clock.svg';
import receiveIcon from 'assets/receiveIcon.svg';
import withdrawIcon from 'assets/withdrawIcon.svg';
import { dispatch } from 'store/rematch';
import { selectTokelPriceUSD } from 'store/selectors';
import { formatDec } from 'util/helpers';
import { TxType } from 'util/nspvlib-mock';
import { V } from 'util/theming';
import { ModalName, TICKER } from 'vars/defines';

import InfoNote from 'components/_General/InfoNote';

const ActivityListRoot = styled.div`
  overflow-y: auto;
`;

const Transaction = styled.div<{ fullView: boolean }>`
  border-bottom: 1px solid ${V.color.backSoftest};
  display: grid;
  grid-template-columns: ${p => (p.fullView ? '10% 20% 10% 20% 40%' : '40% 25% 5% 30%')};
  padding: 0 28px;
  padding-bottom: 10px;
  cursor: pointer;
  &:hover {
    background-color: ${V.color.backSofter};
  }
  &:last-of-type {
    border-bottom: none;
  }
`;

const Datetime = styled.span`
  color: var(--color-gray);
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

type ActivityListProps = {
  transactions: Array<TxType>;
  fullView?: boolean;
};

const handleTxDetailView = tx => {
  dispatch.account.SET_CHOSEN_TX(tx);
  dispatch.environment.SET_MODAL_NAME(ModalName.TX_DETAIL);
};

const ActivityList = ({ transactions = [], fullView }: ActivityListProps): ReactElement => {
  const tokelPriceUSD = useSelector(selectTokelPriceUSD);

  return (
    <ActivityListRoot>
      {transactions.length === 0 && <InfoNote title="No data available" />}
      {transactions.map(tx => (
        <Transaction
          key={tx.txid + tx.received}
          fullView={fullView}
          onClick={() => handleTxDetailView(tx)}
        >
          <Column>
            <img
              alt="confirmation-status"
              width="20px"
              src={tx.unconfirmed ? clockIcon : checkIcon}
            />
          </Column>
          <Column>
            <Datetime>{tx.time ? tx.time : 'N/A'}</Datetime>
          </Column>
          {fullView && (
            <Column>
              <img alt="walletIcon" width="20px" src={tx.received ? receiveIcon : withdrawIcon} />
            </Column>
          )}
          <Column>
            <p className="info">{tx.received ? 'Received' : 'Sent'}</p>
            <p className="additionalInfo">{tx.received ? 'Deposit' : 'Withdrawal'}</p>
          </Column>
          <Column>
            <p className="info" style={{ textAlign: 'right' }}>
              {` ${tx.received ? '+' : '-'}${formatDec(tx.value)} ${TICKER}`}
            </p>
            <p className="additionalInfo" style={{ textAlign: 'right' }}>
              ${(tx.value * tokelPriceUSD).toFixed(2)}
            </p>
          </Column>
        </Transaction>
      ))}
    </ActivityListRoot>
  );
};
ActivityList.defaultProps = {
  fullView: false,
};
export default ActivityList;
