import React from 'react';

import MarketOrderWidget from './MarketOrder';

interface AskOrderWidgetProps {}

const AskOrderWidget: React.FC<AskOrderWidgetProps> = () => {
  return <MarketOrderWidget type="ask" />;
};

export default AskOrderWidget;
