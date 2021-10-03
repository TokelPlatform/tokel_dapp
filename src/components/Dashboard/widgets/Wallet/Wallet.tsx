import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import UpArrow from 'assets/UpArrow.svg';
import { Asset } from 'store/models/wallet';
import { dispatch } from 'store/rematch';
import { selectTransactions } from 'store/selectors';
import { formatDec } from 'util/helpers';
import { Colors, ModalName } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import { WidgetContainer, WidgetTitle } from '../common';
import ActivityListEmbed from '../Embeds/ActivityListEmbed';

const WalletRoot = styled(WidgetContainer)`
  grid-column: span 5;
`;

type TabTitleProps = {
  active: boolean;
};

const TabTitle = styled(WidgetTitle)<TabTitleProps>`
  font-size: 20px;
  padding-right: 28px;
  cursor: pointer;
  opacity: 0.6;
  border: 0;
  outline: 0;
  ${({ active }) =>
    active &&
    `
    border-bottom: 2px solid var(--color-purple);
    opacity: 1;
  `}
`;

const WalletContainer = styled.div`
  border-top: var(--border-dark);
`;

const WalletWrapper = styled.div`
  margin-left: 28px;
  display: grid;
  grid-template-columns: 45% 25% 30%;

  .colTitle {
    text-transform: uppercase;
    font-size: var(--font-size-additional-p);
    color: gray;
  }

  .colValue {
    font-size: 32px;
    font-weight: 400;
    margin-bottom: 0;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
  button {
    margin: 12px;
  }
`;

const PriceChange = styled.div`
  display: flex;
  img {
    margin-right: 8px;
  }
  p {
    color: var(--color-growth);
    margin: 0;
  }
`;

type WalletProps = {
  asset: Asset;
};

const tabs = ['Wallet', 'Recent Activity'];

const Wallet = ({ asset }: WalletProps): ReactElement => {
  const [active, setActive] = useState(tabs[0]);
  const txs = useSelector(selectTransactions).slice(0, 3);

  const handleSend = (): void => {
    dispatch.environment.SET_MODAL(ModalName.SEND);
  };
  const handleReceive = (): void => {
    dispatch.environment.SET_MODAL(ModalName.RECEIVE);
  };

  return (
    <WalletRoot>
      <div style={{ display: 'flex' }}>
        {tabs.map(type => (
          <TabTitle key={type} active={active === type} onClick={() => setActive(type)}>
            {type}
          </TabTitle>
        ))}
      </div>
      <WalletContainer>
        {active === 'Wallet' && (
          <div>
            <WalletWrapper>
              <div>
                <p className="colTitle">Holdings</p>
                <p className="colValue">
                  {formatDec(asset.balance)} {asset.ticker}
                </p>
              </div>
              <div>
                <p className="colTitle">{asset.name} price</p>
                <p className="colValue">$TBA</p>
                {/* <p className="colValue">${formatFiat(asset.usd_value)}</p> */}
                <PriceChange>
                  <img alt="arrowup" src={UpArrow} />
                  <p>10000 %</p>
                </PriceChange>
              </div>
              <div>
                <p className="colTitle">{asset.name} holdings value</p>
                <p className="colValue">$TBA</p>
                {/* <p className="colValue">${formatFiat(asset.balance * asset.usd_value)}</p> */}
              </div>
            </WalletWrapper>
            <ButtonWrapper>
              <Button onClick={handleSend} customWidth="170px" theme={Colors.TRANSPARENT}>
                Send
              </Button>
              <Button onClick={handleReceive} customWidth="170px" theme={Colors.TRANSPARENT}>
                Receive
              </Button>
            </ButtonWrapper>
          </div>
        )}
        {active === 'Recent Activity' && <ActivityListEmbed transactions={txs} />}
      </WalletContainer>
    </WalletRoot>
  );
};

export default Wallet;
