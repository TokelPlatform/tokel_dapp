import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectCurrentTokenInfo } from 'store/selectors';
import { V } from 'util/theming';
import { Colors, ModalName } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import { EmbedContentContainer } from './common';

const Holdings = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HoldingsTitle = styled.h2`
  margin-bottom: 10px;
  text-transform: uppercase;
  font-size: ${V.font.h3};
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

const openSendModal = options => dispatch.environment.SET_MODAL({ name: ModalName.SEND, options });
const openReceiveModal = () => dispatch.environment.SET_MODAL_NAME(ModalName.RECEIVE);

const TransferEmbed = () => {
  const tokenInfo = useSelector(selectCurrentTokenInfo);
  const isNFT = tokenInfo.supply === 1;

  return (
    <EmbedContentContainer>
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
        <Button onClick={openSendModal} theme={Colors.TRANSPARENT}>
          Send
        </Button>
        {!isNFT && (
          <Button onClick={openReceiveModal} theme={Colors.TRANSPARENT}>
            Receive
          </Button>
        )}
      </Buttons>
    </EmbedContentContainer>
  );
};

export default TransferEmbed;
