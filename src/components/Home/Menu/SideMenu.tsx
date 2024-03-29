import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';

import BagIcon from 'assets/Bag.svg';
import SwapIcon from 'assets/Swap.svg';
import ToggleIcon from 'assets/Toggle.svg';
import TokenIcon from 'assets/Token.svg';
import WalletIcon from 'assets/Wallet.svg';
import { dispatch } from 'store/rematch';
import { selectView } from 'store/selectors';
import { VERSIONS_MSG, ViewType } from 'vars/defines';

import { GrayLabel } from 'components/Dashboard/widgets/common';
import MenuItem from './MenuItem';

export const menuData = [
  {
    type: ViewType.DASHBOARD,
    name: 'Wallet',
    icon: WalletIcon,
  },
  {
    type: ViewType.DEX,
    name: 'DEX',
    icon: BagIcon,
  },
  {
    type: ViewType.CREATE_TOKEN,
    name: 'Create',
    icon: TokenIcon,
  },
  {
    type: ViewType.SWAP,
    name: 'Swap',
    icon: SwapIcon,
  },
  {
    type: ViewType.SETTINGS,
    name: 'Settings',
    icon: ToggleIcon,
  },
];

const SideMenuRoot = styled.div`
  position: relative;
  background-color: var(--color-almostBlack);
  height: 100%;
  width: 108px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  padding-bottom: 20px;
  overflow-y: auto;
`;

const SideMenu = () => {
  const currentView = useSelector(selectView);
  const [currVersion, setCurrVersion] = React.useState(null);

  React.useEffect(() => {
    if (!currVersion) {
      ipcRenderer.send(VERSIONS_MSG);
    }

    ipcRenderer.on(VERSIONS_MSG, (_, { version }) => {
      setCurrVersion(version);
    });
    return () => {
      ipcRenderer.removeAllListeners(VERSIONS_MSG);
    };
  }, [currVersion]);

  return (
    <SideMenuRoot data-tid="sidemenu">
      <div>
        {menuData.map(menuItem => (
          <MenuItem
            key={menuItem.name}
            onClick={() => dispatch.environment.SET_VIEW(menuItem.type)}
            name={menuItem.name}
            icon={menuItem.icon}
            selected={menuItem.type === currentView}
          />
        ))}
      </div>
      <GrayLabel>v {currVersion}</GrayLabel>
    </SideMenuRoot>
  );
};

export { SideMenuRoot };
export default SideMenu;
