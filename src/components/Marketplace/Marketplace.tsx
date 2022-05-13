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
import ViewContext, { MARKETPLACE_VIEWS } from './common/ViewContext';
import MarketOrderWidget from './widgets/MarketOrder';
import MyOffersWidget from './widgets/MyOffers';
import MyOrdersWidget from './widgets/MyOrders';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MarketplaceProps {}

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
    name: 'Offers',
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
  const [currentOrderId, setCurrentOrderId] = useState<string | undefined>();

  const CurrentTab = () => {
    switch (currentView) {
      case MARKETPLACE_VIEWS.FILL:
        return (
          <AbsoluteCenter>
            <MarketOrderWidget type="fill" />
          </AbsoluteCenter>
        );
      case MARKETPLACE_VIEWS.ASK:
        return (
          <AbsoluteCenter>
            <MarketOrderWidget type="ask" />
          </AbsoluteCenter>
        );
      case MARKETPLACE_VIEWS.BID:
        return (
          <AbsoluteCenter>
            <MarketOrderWidget type="bid" />
          </AbsoluteCenter>
        );
      case MARKETPLACE_VIEWS.ORDERS:
        return <MyOrdersWidget />;
      case MARKETPLACE_VIEWS.OFFERS:
        return <MyOffersWidget />;
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
          border-left: 1px solid ${V.color.backSofter};
          background-color: ${V.color.backHard};
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
        <ViewContext.Provider
          value={{ currentView, setCurrentView, currentOrderId, setCurrentOrderId }}
        >
          <CurrentTab />
        </ViewContext.Provider>
      </Layout>
    </>
  );
};

export default Marketplace;
