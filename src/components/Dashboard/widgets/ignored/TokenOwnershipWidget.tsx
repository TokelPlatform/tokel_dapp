import React from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { V } from 'util/theming';

import { WidgetContainer, WidgetTitle } from '../common';

const TokenOwnershipWidgetRoot = styled(WidgetContainer)`
  grid-column: span 5;
  grid-row: span 2;
`;

const Tabs = styled.div`
  display: flex;
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
    css`
      border-bottom: 2px solid ${V.color.lilac};
      opacity: 1;
    `}
`;

const WalletContainer = styled.div`
  border-top: var(--border-dark);
`;

const Tab = {
  WALLET: 'wallet',
  RECENT: 'recent',
};

const TabName = {
  [Tab.WALLET]: 'Wallet',
  [Tab.RECENT]: 'Recent Activity',
};

const Pane = {
  [Tab.WALLET]: <div>suck my piss</div>,
  [Tab.RECENT]: <div>bite my ass</div>,
};

const TokenOwnershipWidget = () => {
  const [activeTab, setActiveTab] = React.useState(Tab.WALLET);

  return (
    <TokenOwnershipWidgetRoot>
      <Tabs>
        {Object.values(Tab).map(tabKey => (
          <TabTitle key={tabKey} active={activeTab === tabKey} onClick={() => setActiveTab(tabKey)}>
            {TabName[tabKey]}
          </TabTitle>
        ))}
      </Tabs>
      <WalletContainer>{Pane[activeTab]}</WalletContainer>
    </TokenOwnershipWidgetRoot>
  );
};

export default TokenOwnershipWidget;
