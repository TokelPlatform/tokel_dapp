import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import receiveIcon from 'assets/receiveIcon.svg';
import withdrawIcon from 'assets/withdrawIcon.svg';
import { dispatch } from 'store/rematch';
import { selectChosenAsset, selectModal } from 'store/selectors';
import { formatDec, formatFiat } from 'util/helpers';
import { TxType } from 'util/nspvlib-mock';
import { CURRENCY, Colors, ModalName, USD_VALUE } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import InfoNote from 'components/_General/InfoNote';
import modals from 'components/Modal/content';
import Modal from 'components/Modal/Modal';

const ActivityListRoot = styled.div`
  grid-column: span 3;
`;

type TransactionsProps = {
  fullView: boolean;
};

const Transactions = styled.div<TransactionsProps>`
  display: grid;
  grid-template-columns: ${props => {
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
  const modalProps = modals[useSelector(selectModal)];

  const handleTxDetailView = tx => {
    dispatch.account.SET_CHOSEN_TX(tx);
    dispatch.environment.SET_MODAL(ModalName.TX_DETAIL);
  };
  return (
    <ActivityListRoot>
      {modalProps && <Modal title={modalProps.title}>{modalProps.children}</Modal>}
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
                {(tx.received ? '+' : '-').concat(formatDec(tx.value))} {CURRENCY}
              </p>
              <p className="additionalInfo" style={{ textAlign: 'right' }}>
                ${formatFiat(tx.value * USD_VALUE)}
              </p>
            </Column>
            {fullView && (
              <Column style={{ justifySelf: 'flex-end' }}>
                <Button
                  onClick={() =>
                    handleTxDetailView({ txid: tx.txid, value: tx.value, recepient: tx.recepient })
                  }
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
