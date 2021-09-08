import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectCurrentTokenInfo } from 'store/selectors';

import StandardWidget from './widgets/StandardWidget';
import TokenDetailWidget from './widgets/TokenDetailWidget';
import TokenHistoryWidget from './widgets/TokenOwnership/TokenHistoryWidget';
import TokenTransferWidget from './widgets/TokenOwnership/TokenTransferWidget';

const TokenViewRoot = styled.div`
  flex: 1;
  height: 100%;
  margin-left: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-gap: 20px;
  overflow-y: auto;
`;

const TokenView = (): ReactElement => {
  const tokenInfo = useSelector(selectCurrentTokenInfo);
  const isNFT = tokenInfo.supply === 1;

  return (
    <TokenViewRoot>
      <TokenDetailWidget />
      <TokenTransferWidget />
      {isNFT ? <TokenHistoryWidget /> : <StandardWidget title="Activity">dingus</StandardWidget>}
    </TokenViewRoot>
  );
};
export default TokenView;
