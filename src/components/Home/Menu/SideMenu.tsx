import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';

import BagIcon from 'assets/Bag.svg';
import DashIcon from 'assets/Dash.svg';
import SwapIcon from 'assets/Swap.svg';
import ToggleIcon from 'assets/Toggle.svg';
import TokenIcon from 'assets/Token.svg';

import { dispatch } from 'store/rematch';
import { selectView } from 'store/selectors';
import { VERSIONS_MSG, ViewType } from 'vars/defines';

import { GrayLabel } from 'components/Dashboard/widgets/common';
import MenuItem from './MenuItem';

export const menuData = [
  {
    type: ViewType.DASHBOARD,
    name: 'Dashboard',
    icon: DashIcon,
  },
  {
    type: ViewType.CREATE_TOKEN,
    name: 'Create Token',
    icon: TokenIcon,
  },
  {
    type: ViewType.DEX,
    name: 'DEX',
    icon: SwapIcon,
  },
  {
    type: ViewType.NFT_MARKET,
    name: 'NFT Market',
    icon: BagIcon,
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
  const [currVersion, setCurrVersion] = useState(null);

  useEffect(() => {
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

export default SideMenu;
