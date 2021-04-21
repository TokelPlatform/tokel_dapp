import React, { ReactElement, useState } from 'react';

import styled from '@emotion/styled';

import { Asset } from 'store/models/wallet';

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
type WalletProps = {
  asset: Asset;
};

const tabs = ['Wallet', 'Recent Activity'];

const Wallet = ({ asset }: WalletProps): ReactElement => {
  const [active, setActive] = useState(tabs[0]);
  return (
    <WalletRoot>
      <div style={{ display: 'flex' }}>
        {/* <WalletTitle>{asset.name} Wallet</WalletTitle>
         */}
        {tabs.map(type => (
          <WalletTitle key={type} active={active === type} onClick={() => setActive(type)}>
            {type}
          </WalletTitle>
        ))}
      </div>
      {active === 'Wallet' && (
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
      )}
      {active === 'Recent Activity' && <ActivityTable />}
    </WalletRoot>
  );
};

export default Wallet;
