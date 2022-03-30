import React from 'react';

import MarketOrderWidget from './MarketOrder';

interface FulfillOrderWidgetProps {}

const FulfillOrderWidget: React.FC<FulfillOrderWidgetProps> = () => {
  const handleFulfillOrder = () => {};

  return <MarketOrderWidget type="fill" />;
};

export default FulfillOrderWidget;
