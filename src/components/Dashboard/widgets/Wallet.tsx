import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Asset } from 'store/models/wallet';

import { WidgetContainer, WidgetTitle } from './common';

const WalletRoot = styled(WidgetContainer)`
  grid-column: span 5;
`;

type WalletProps = {
  asset: Asset;
};

const Wallet = ({ asset }: WalletProps): ReactElement => {
  console.log(asset.name);
  return (
    <WalletRoot>
      <WidgetTitle>{asset.name} Wallet</WidgetTitle>
    </WalletRoot>
  );
};

export default Wallet;
