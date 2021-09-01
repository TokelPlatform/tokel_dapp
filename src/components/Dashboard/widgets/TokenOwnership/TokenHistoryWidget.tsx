import React from 'react';

import TokenTableWidget from './TokenTableWidget';

const dummyData = [{ hello: 'darkness' }];

const TokenHistoryWidget = () => {
  return <TokenTableWidget title="Purchase History" data={dummyData} />;
};

export default TokenHistoryWidget;
