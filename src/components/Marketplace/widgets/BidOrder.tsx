import React from 'react';

import MarketOrderWidget from './MarketOrder';

interface BidOrderWidgetProps {}

const BidOrderWidget: React.FC<BidOrderWidgetProps> = () => {
  return <MarketOrderWidget type="bid" />;
};

export default BidOrderWidget;
