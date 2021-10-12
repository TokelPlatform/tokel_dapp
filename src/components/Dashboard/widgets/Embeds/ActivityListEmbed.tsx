import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import checkIcon from 'assets/Check.svg';
import clockIcon from 'assets/Clock.svg';
import receiveIcon from 'assets/receiveIcon.svg';
import withdrawIcon from 'assets/withdrawIcon.svg';
import { dispatch } from 'store/rematch';
import { selectTokelPriceUSD } from 'store/selectors';
import { formatDate, formatDec } from 'util/helpers';
import { TxType } from 'util/nspvlib-mock';
import { V } from 'util/theming';
import { ModalName, TICKER } from 'vars/defines';

import InfoNote from 'components/_General/InfoNote';

const ActivityListRoot = styled.div`
  overflow-y: auto;
`;

const Transaction = styled.div`
  border-bottom: 1px solid ${V.color.backSoftest};
  display: grid;
  min-width: 400px;
  grid-template-columns: 32% 32% 36%;
  padding: 0 14px;
  cursor: pointer;
  &:hover {
    background-color: ${V.color.backSofter};
  }
  &:last-of-type {
    border-bottom: none;
  }
`;

const TriCellRoot = styled.div`
  display: flex;
  padding: 14px 8px;
`;

const TriCellIcon = styled.img`
  margin-right: 12px;
`;

const TriCellInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Primary = styled.span`
  font-size: ${V.font.p};
`;

const Secondary = styled.span`
  color: ${V.color.frontSoft};
  font-size: ${V.font.pSmall};
`;

type TriCellProps = {
  icon?: string;
  primary?: string;
  secondary?: string;
  justify?: 'flex-start' | 'center' | 'flex-end';
};

const TriCell = ({ icon, primary, secondary, justify }: TriCellProps) => (
  <TriCellRoot style={{ justifyContent: justify ?? 'flex-start' }}>
    {icon && <TriCellIcon width="20px" src={icon} alt={icon} />}
    <TriCellInfo>
      <Primary>{primary}</Primary>
      <Secondary>{secondary}</Secondary>
    </TriCellInfo>
  </TriCellRoot>
);

type ActivityListProps = {
  transactions: Array<TxType>;
};

const handleTxDetailView = (tx: TxType) => {
  dispatch.account.SET_CHOSEN_TX(tx);
  dispatch.environment.SET_MODAL_NAME(ModalName.TX_DETAIL);
};

const ActivityList = ({ transactions = [] }: ActivityListProps): ReactElement => {
  const tokelPriceUSD = useSelector(selectTokelPriceUSD);

  return (
    <ActivityListRoot>
      {transactions.length === 0 && <InfoNote title="No data available" />}
      {transactions
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(tx => {
          const times = tx.timestamp ? formatDate(tx.timestamp).split(' ') : ['N/A', ''];
          return (
            <Transaction key={tx.txid + tx.received} onClick={() => handleTxDetailView(tx)}>
              <TriCell
                icon={tx.unconfirmed ? checkIcon : clockIcon}
                primary={times[0]}
                secondary={times[1]}
              />
              <TriCell
                icon={tx.received ? receiveIcon : withdrawIcon}
                primary={tx.received ? 'Received' : 'Sent'}
                secondary={tx.received ? 'Deposit' : 'Withdrawal'}
                justify="center"
              />
              <TriCell
                primary={` ${tx.received ? '+' : '-'}${formatDec(tx.value)} ${TICKER}`}
                secondary={(tx.value * tokelPriceUSD).toFixed(2)}
                justify="flex-end"
              />
            </Transaction>
          );
        })}
    </ActivityListRoot>
  );
};

export default ActivityList;
