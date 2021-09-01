import React from 'react';

import TokenTableWidget from './TokenTableWidget';

const dummyData = [{ hello: 'darkness' }];

const TokenActivityWidget = () => {
  return <TokenTableWidget title="Recent Activity" data={dummyData} />;
};

export default TokenActivityWidget;
