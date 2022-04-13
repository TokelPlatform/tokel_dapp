import React, { useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import askOrderIcon from 'assets/askOrder.svg';
import bidOrderIcon from 'assets/bidOrder.svg';
import fillOrderIcon from 'assets/fillOrder.svg';
import inboxIcon from 'assets/inbox.svg';
import listIcon from 'assets/list.svg';
import trendUpIcon from 'assets/trendUp.svg';
import { V } from 'util/theming';

import { Layout, SubTitle, Title } from 'components/_General/_UIElements/common';
import Icon from 'components/_General/_UIElements/Icon';
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

const AbsoluteCenter = styled.div`
  margin: auto;
  width: 480px;
`;

const WelcomeMessageWrapper = styled.div`
  margin: auto;
  min-width: 480px;

  ${Title} {
    color: ${V.color.frontSoft};
    margin-bottom: 0;
  }

  ${SubTitle} {
    margin-top: 5px;
  }
`;

const Marketplace: React.FC<MarketplaceProps> = () => {
  const [currentView, setCurrentView] = useState<MARKETPLACE_VIEWS | null>(null);

  const CurrentTab = () => {
    switch (currentView) {
      case MARKETPLACE_VIEWS.FILL:
        return (
          <AbsoluteCenter>
            <FulfillOrderWidget />
          </AbsoluteCenter>
        );
      case MARKETPLACE_VIEWS.BID:
        return (
          <AbsoluteCenter>
            <BidOrderWidget />
          </AbsoluteCenter>
        );
      case MARKETPLACE_VIEWS.ASK:
        return (
          <AbsoluteCenter>
            <AskOrderWidget />
          </AbsoluteCenter>
        );
      case MARKETPLACE_VIEWS.ORDERS:
        return <MyOrdersWidget />;
      case MARKETPLACE_VIEWS.OFFERS:
        return <MyAssetsBidsWidget />;
      case null:
      default:
        return (
          <WelcomeMessageWrapper
            css={css`
              text-align: center;
            `}
          >
            <Icon icon={trendUpIcon} height={40} color="frontSoft" centered />
            <Title>Welcome to to the Tokel Token & NFT market</Title>
            <SubTitle>Select an option on the side menu to begin</SubTitle>
          </WelcomeMessageWrapper>
        );
    }
  };

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
      <Layout>
        <CurrentTab />
      </Layout>
    </>
  );
};

export default Marketplace;
