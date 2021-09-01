import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectCurrentTokenInfo } from 'store/selectors';
import { V } from 'util/theming';
import { Colors } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import { WidgetContainer, WidgetTitle } from '../common';

const TokenTransferWidgetRoot = styled(WidgetContainer)`
  grid-column: span 2;
  grid-row: span 2;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Holdings = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HoldingsTitle = styled.h2`
  margin-bottom: 10px;
  text-transform: uppercase;
  font-size: ${V.font.h2};
  color: ${V.color.frontSoft};
`;

const HoldingsValue = styled.span`
  background-color: ${V.color.backHarder};
  border: 1px solid ${V.color.backSoftest};
  padding: 4px 14px;
  border-radius: ${V.size.borderRadiusBig};
  font-size: ${V.font.h1};
  color: ${V.color.frontSofter};
`;

const HoldingsNFTMessage = styled(HoldingsValue)`
  font-size: ${V.font.h3};
  text-align: center;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const TokenTransferWidget = () => {
  const tokenInfo = useSelector(selectCurrentTokenInfo);
  const isNFT = tokenInfo.supply === 1;

  return (
    <TokenTransferWidgetRoot>
      <WidgetTitle bottomBorder>Transfer</WidgetTitle>
      <Content>
        <Holdings>
          {isNFT ? (
            <HoldingsNFTMessage>This is an NFT. You own the only one!</HoldingsNFTMessage>
          ) : (
            <>
              <HoldingsTitle>Holdings</HoldingsTitle>
              <HoldingsValue>{tokenInfo.balance}</HoldingsValue>
            </>
          )}
        </Holdings>
        <Buttons>
          <Button theme={Colors.TRANSPARENT}>Send</Button>
          {!isNFT && <Button theme={Colors.TRANSPARENT}>Receive</Button>}
        </Buttons>
      </Content>
    </TokenTransferWidgetRoot>
  );
};

export default TokenTransferWidget;
