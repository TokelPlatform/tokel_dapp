import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import bagIcon from 'assets/Bag.svg';
import checkIcon from 'assets/Check.svg';
import clockIcon from 'assets/Clock.svg';
import receiveIcon from 'assets/receiveIcon.svg';
import withdrawIcon from 'assets/withdrawIcon.svg';
import { dispatch } from 'store/rematch';
import { selectTokelPriceUSD } from 'store/selectors';
import { formatDate, getUsdValue, processPossibleBN, toBitcoinAmount } from 'util/helpers';
import { TxType } from 'util/nspvlib-mock';
import { V } from 'util/theming';
import { Colors, ModalName, ResourceType, TICKER } from 'vars/defines';

import ExplorerLink from 'components/_General/ExplorerLink';
import InfoNote from 'components/_General/InfoNote';

const ActivityListRoot = styled.div`
  overflow-y: auto;
`;

const ActivityListItem = styled.div`
  min-width: fit-content;
  width: 100%;
  display: flex;
  border-bottom: 1px solid ${V.color.backSoftest};
  &:hover {
    background-color: ${V.color.backSofter};
  }
  &:last-of-type {
    border-bottom: none;
  }
`;

const Transaction = styled.div`
  display: grid;
  min-width: 400px;
  width: fill-available;
  grid-template-columns: 36% 24% 38%;
  padding: 0 14px;
  cursor: pointer;
`;

const ExplorerLinkWrapper = styled.div`
  width: 60px;
  padding-right: 5px;
  display: flex;
  align-items: center;
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

const handleTxDetailView = (tx: TxType) => {
  dispatch.account.SET_CHOSEN_TX(tx);
  dispatch.environment.SET_MODAL_NAME(ModalName.TX_DETAIL);
};

enum ActivityType {
  MINTED = 'mint',
  SENT = 'sent',
  RECEIVED = 'received',
}

const ActivityMap = {
  [ActivityType.MINTED]: {
    icon: bagIcon,
    primary: 'Minted',
    secondary: 'Created',
  },
  [ActivityType.SENT]: {
    icon: withdrawIcon,
    primary: 'Sent',
    secondary: 'Withdrawal',
  },
  [ActivityType.RECEIVED]: {
    icon: receiveIcon,
    primary: 'Received',
    secondary: 'Deposit',
  },
};

type ActivityListProps = {
  transactions: Array<TxType>;
  resourceType: ResourceType;
};

const ActivityList = ({ transactions = [], resourceType }: ActivityListProps): ReactElement => {
  const tokelPriceUSD = useSelector(selectTokelPriceUSD);

  return (
    <ActivityListRoot>
      {transactions.length === 0 && <InfoNote title="No data available" />}
      {transactions
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(tx => {
          const times = tx.timestamp ? formatDate(tx.timestamp).split(' ') : ['N/A', ''];
          // eslint-disable-next-line no-nested-ternary
          const activityType = tx.from
            ? tx.received
              ? ActivityType.RECEIVED
              : ActivityType.SENT
            : ActivityType.MINTED;
          const activityData = ActivityMap[activityType];
          return (
            <ActivityListItem key={tx.txid + tx.received}>
              <Transaction onClick={() => handleTxDetailView(tx)}>
                <TriCell
                  icon={tx.unconfirmed ? clockIcon : checkIcon}
                  primary={times[0]}
                  secondary={times[1]}
                />
                <TriCell
                  icon={activityData.icon}
                  primary={activityData.primary}
                  secondary={activityData.secondary}
                />
                <TriCell
                  primary={` ${tx.received ? '+' : '-'}${toBitcoinAmount(
                    processPossibleBN(tx.value)
                  )} ${TICKER}`}
                  secondary={
                    resourceType === ResourceType.TOKEL
                      ? `$${getUsdValue(processPossibleBN(tx.value), tokelPriceUSD)}`
                      : ''
                  }
                  justify="flex-end"
                />
              </Transaction>
              <ExplorerLinkWrapper>
                <ExplorerLink display="none" txidColor={Colors.WHITE} txid={tx.txid} />
              </ExplorerLinkWrapper>
            </ActivityListItem>
          );
        })}
    </ActivityListRoot>
  );
};

export default ActivityList;
