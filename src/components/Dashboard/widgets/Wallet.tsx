import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import { Asset } from 'store/models/wallet';

import { WidgetContainer, WidgetTitle } from './common';

const WalletRoot = styled(WidgetContainer)`
  grid-column: span 5;
`;

const WalletTitle = styled(WidgetTitle)`
  width: 100%;
`;

const WalletContainer = styled.div`
  margin-left: 28px;
  /* border-top: 1px solid var(--color-almostBlack2); */
  display: grid;
  grid-template-columns: 45% 25% 30%;

  .colTitle {
    text-transform: uppercase;
    font-size: var(--font-size-additional-p);
    color: gray;
  }

  .colValue {
    font-size: 32px;
    font-weight: 400;
  }
`;
type WalletProps = {
  asset: Asset;
};

const Wallet = ({ asset }: WalletProps): ReactElement => {
  console.log(asset.name);
  return (
    <WalletRoot>
      <div>
        <WalletTitle>{asset.name} Wallet</WalletTitle>
      </div>
      <WalletContainer>
        <div>
          <p className="colTitle">Holdings</p>
          <p className="colValue">0.07770000 {asset.ticker}</p>
        </div>
        <div>
          <p className="colTitle">{asset.name} price</p>
          <p className="colValue">$8,242</p>
        </div>
        <div>
          <p className="colTitle">{asset.name} holdings value</p>
          <p className="colValue">$6,404.04</p>
        </div>
      </WalletContainer>
    </WalletRoot>
  );
};

export default Wallet;
