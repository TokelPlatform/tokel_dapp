import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectCurrentTokenInfo } from 'store/selectors';
import { V } from 'util/theming';
import { Colors, ModalName, ResourceType } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import { ReceiveModalOpts } from 'components/Modal/content/Receive';
import { EmbedContentContainer } from '../common';

const Holdings = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  padding-top: 10px;
  overflow-y: auto;
`;

const HoldingSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3px 0;
`;

const HoldingSectionLabel = styled.h3`
  margin-bottom: 10px;
  text-transform: uppercase;
  font-size: ${V.font.h3};
  color: ${V.color.frontSoft};
`;

const HoldingSectionValue = styled.span`
  font-size: ${V.font.h1};
`;

// const HoldingsValue = styled.span`
//   background-color: ${V.color.backHarder};
//   border: 1px solid ${V.color.backSoftest};
//   padding: 4px 14px;
//   border-radius: ${V.size.borderRadiusBig};
//   font-size: ${V.font.h1};
//   color: ${V.color.frontSofter};
// `;

const HoldingsNFTMessage = styled.span`
  background-color: ${V.color.backHarder};
  border: 1px solid ${V.color.backSoftest};
  padding: 4px 14px;
  border-radius: ${V.size.borderRadiusBig};
  font-size: ${V.font.h3};
  color: ${V.color.frontSofter};
  text-align: center;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const MarginedButton = styled(Button)`
  margin: 10px;
  margin-top: 0;
`;

const openSendModal = options => () =>
  dispatch.environment.SET_MODAL({ name: ModalName.SEND, options });
const openReceiveModal = (options: ReceiveModalOpts) => () =>
  dispatch.environment.SET_MODAL({ name: ModalName.RECEIVE, options });

export type HoldingType = {
  label: string;
  value: number;
};

type TransferEmbedProps = {
  holdingSections?: Array<HoldingType>;
};

const TransferEmbed = ({ holdingSections }: TransferEmbedProps) => {
  const tokenInfo = useSelector(selectCurrentTokenInfo);
  const isNFT = tokenInfo && tokenInfo.supply === 1;
  const sections = holdingSections ?? [{ label: 'holdings', value: tokenInfo.balance }];

  return (
    <EmbedContentContainer>
      <Holdings>
        {isNFT ? (
          <HoldingsNFTMessage>This is an NFT. You own the only one!</HoldingsNFTMessage>
        ) : (
          sections.map(section => (
            <HoldingSection key={section.label}>
              <HoldingSectionLabel>{section.label}</HoldingSectionLabel>
              <HoldingSectionValue>{section.value}</HoldingSectionValue>
            </HoldingSection>
          ))
        )}
      </Holdings>
      <Buttons>
        <MarginedButton
          onClick={openSendModal({
            // eslint-disable-next-line no-nested-ternary
            type: tokenInfo ? (isNFT ? ResourceType.NFT : ResourceType.FST) : ResourceType.TOKEL,
          })}
          theme={Colors.TRANSPARENT}
        >
          Send
        </MarginedButton>
        <MarginedButton
          onClick={openReceiveModal({
            // eslint-disable-next-line no-nested-ternary
            type: tokenInfo ? (isNFT ? ResourceType.NFT : ResourceType.FST) : ResourceType.TOKEL,
          })}
          theme={Colors.TRANSPARENT}
        >
          Receive
        </MarginedButton>
      </Buttons>
    </EmbedContentContainer>
  );
};

export default TransferEmbed;
