import React, { ReactElement, useState } from 'react';

import styled from '@emotion/styled';

import { Asset } from 'store/models/wallet';

import { Button } from 'components/_General/buttons';
import ActivityTable from './ActivityTable';
import { WidgetContainer, WidgetTitle } from './common';

const WalletRoot = styled(WidgetContainer)`
  grid-column: span 5;
`;

const WalletTitle = styled(WidgetTitle)`
  font-size: 20px;
  padding: 10px 60px;
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
  margin-left: 28px;
  border-top: 1px solid var(--color-almostBlack2);
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
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  button {
    margin: 12px;
  }
`;
type WalletProps = {
  asset: Asset;
};

const tabs = ['Wallet', 'Recent Activity'];

const Wallet = ({ asset }: WalletProps): ReactElement => {
  const [active, setActive] = useState(tabs[0]);

  const handleClick = (): void => {
    console.log('click');
  };

  return (
    <WalletRoot>
      <div style={{ display: 'flex' }}>
        {tabs.map(type => (
          <WalletTitle key={type} active={active === type} onClick={() => setActive(type)}>
            {type}
          </WalletTitle>
        ))}
      </div>
      {active === 'Wallet' && (
        <div>
          <WalletContainer>
            <div>
              <p className="colTitle">Holdings</p>
              <p className="colValue">0.07770000 {asset.ticker}</p>
            </div>
            <div>
              <p className="colTitle">{asset.name} price</p>
              <p className="colValue">$8,242</p>
            </div>
            <div>
              <p className="colTitle">{asset.name} holdings value</p>
              <p className="colValue">$6,404.04</p>
            </div>
          </WalletContainer>
          <ButtonWrapper>
            <Button onClick={handleClick} customWidth="170px" theme="gray">
              Send
            </Button>
            <Button onClick={handleClick} customWidth="170px" theme="gray">
              Receive
            </Button>
          </ButtonWrapper>
        </div>
      )}
      {active === 'Recent Activity' && <ActivityTable />}
    </WalletRoot>
  );
};

export default Wallet;
