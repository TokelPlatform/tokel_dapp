import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import BagIcon from 'assets/Bag.svg';
import DashIcon from 'assets/Dash.svg';
import SwapIcon from 'assets/Swap.svg';
import ToggleIcon from 'assets/Toggle.svg';
import { dispatch } from 'store/rematch';
import { selectView } from 'store/selectors';
import { ViewType } from 'vars/defines';

import MenuItem from './MenuItem';

export const menuData = [
  {
    type: ViewType.DASHBOARD,
    name: 'Dashboard',
    icon: DashIcon,
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
  width: 96px;
  padding-top: 32px;
  overflow-y: scroll;
`;

const SideMenu = (): ReactElement => {
  const currentView = useSelector(selectView);

  return (
    <SideMenuRoot>
      {menuData.map(menuItem => (
        <MenuItem
          key={menuItem.name}
          onClick={() => dispatch.environment.SET_VIEW(menuItem.type)}
          name={menuItem.name}
          icon={menuItem.icon}
          selected={menuItem.type === currentView}
        />
      ))}
    </SideMenuRoot>
  );
};

export default SideMenu;
