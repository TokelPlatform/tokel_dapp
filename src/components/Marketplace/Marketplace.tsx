import React, { useState } from 'react';

import { css } from '@emotion/react';

import askOrderIcon from 'assets/askOrder.svg';
import bidOrderIcon from 'assets/bidOrder.svg';
import fillOrderIcon from 'assets/fillOrder.svg';
import inboxIcon from 'assets/inbox.svg';
import listIcon from 'assets/list.svg';

import { Layout } from 'components/_General/_UIElements/common';
import { Column } from 'components/_General/Grid';
import MenuItem from 'components/Home/Menu/MenuItem';
import { SideMenuRoot } from 'components/Home/Menu/SideMenu';
import AskOrderWidget from './widgets/AskOrder';
import BidOrderWidget from './widgets/BidOrder';
import FulfillOrderWidget from './widgets/FulfillOrder';
import MyAssetsBidsWidget from './widgets/MyAssetsBids';
import MyOrdersWidget from './widgets/MyOrders';

interface MarketplaceProps {}

enum MARKETPLACE_VIEWS {
  FILL,
  ASK,
  BID,
  ORDERS,
  OFFERS,
}

const menuData = [
  {
    type: MARKETPLACE_VIEWS.FILL,
    name: 'Fill Order',
    icon: fillOrderIcon,
  },
  {
    type: MARKETPLACE_VIEWS.ASK,
    name: 'Sell',
    icon: askOrderIcon,
  },
  {
    type: MARKETPLACE_VIEWS.BID,
    name: 'Bid',
    icon: bidOrderIcon,
  },
  {
    type: MARKETPLACE_VIEWS.ORDERS,
    name: 'My Orders',
    icon: listIcon,
  },
  {
    type: MARKETPLACE_VIEWS.OFFERS,
    name: 'My Offers',
    icon: inboxIcon,
  },
];

const Marketplace: React.FC<MarketplaceProps> = () => {
  const [currentView, setCurrentView] = useState<MARKETPLACE_VIEWS | null>(null);

  return (
    <>
      <SideMenuRoot
        data-tid="mktplace-sidemenu"
        css={css`
          margin-right: auto;
        `}
      >
        <div>
          {menuData.map(menuItem => (
            <MenuItem
              key={menuItem.name}
              onClick={() => setCurrentView(menuItem.type)}
              name={menuItem.name}
              icon={menuItem.icon}
              selected={menuItem.type === currentView}
            />
          ))}
        </div>
      </SideMenuRoot>
      {/* <Layout>
        <Column size={4}>
          <AskOrderWidget />
          <FulfillOrderWidget />
        </Column>
        <Column size={4}>
          <BidOrderWidget />
          <MyOrdersWidget />
        </Column>
        <Column size={4}>
          <MyAssetsBidsWidget />
        </Column>
      </Layout> */}
    </>
  );
};

export default Marketplace;
