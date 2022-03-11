import React from 'react';

import { Box, Layout } from 'components/_General/_UIElements/common';
import { Column } from 'components/_General/Grid';
import AskOrderWidget from './widgets/AskOrder';
import BidOrderWidget from './widgets/BidOrder';
import FulfillOrderWidget from './widgets/FulfillOrder';
import MyAssetsBidsWidget from './widgets/MyAssetsBids';
import MyOrdersWidget from './widgets/MyOrders';

interface MarketplaceProps {}

const Marketplace: React.FC<MarketplaceProps> = () => {
  return (
    <Layout>
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
    </Layout>
  );
};

export default Marketplace;
