import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectCurrentTokenBalance, selectCurrentTokenInfo } from 'store/selectors';
import { processPossibleBN } from 'util/helpers';
import icons from 'util/icons';
import { V } from 'util/theming';
import { Colors, ModalName, ResourceType, TICKER } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import { EmbedContentContainer } from '../common';

const Holdings = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  padding-top: 2rem;
  overflow-y: auto;
`;

const HoldingSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
`;

const HoldingSectionRow = styled.div`
  display: flex;
  column-gap: 2rem;
  align-items: flex-start;
  justify-content: flex-start;
`;

const HoldingSectionLabel = styled.h3`
  margin-bottom: 10px;
  text-transform: uppercase;
  font-size: ${V.font.h3};
  color: ${V.color.frontSoft};
`;
const HoldingSectionLabelCoin = styled.p`
  font-size: ${V.font.pSmall};
  color: ${V.color.slate};
  text-transform: uppercase;
  margin: 0;
`;

const HoldingSectionTimelock = styled.p`
  font-size: ${V.font.pSmall};
  margin-top: 0;
  opacity: 0.6;
`;

const HoldingSectionValueCoin = styled.h3`
  margin: 0 0 0.5rem 0;
`;

const HoldingSectionValue = styled.span`
  font-size: ${V.font.h1};
`;

const HoldingsNFTMessage = styled.span`
  background-color: ${V.color.backHarder};
  border: 1px solid ${V.color.backSoftest};
  padding: 4px 14px;
  border-radius: ${V.size.borderRadiusBig};
  font-size: ${V.font.h3};
  color: ${V.color.frontSofter};
  text-align: center;
`;

const MarginedButton = styled(Button)`
  margin: 10px;
  margin-top: 1rem;
`;

const openSendModal = options => () =>
  dispatch.environment.SET_MODAL({ name: ModalName.SEND, options });

export type HoldingType = {
  label: string;
  value: string;
  icon: string;
};

type TransferEmbedProps = {
  holdingSections?: Array<HoldingType>;
};

const renderValue = one => (
  <HoldingSectionValueCoin key={one.lockTime}>
    {`${processPossibleBN(one.value)} ${TICKER}`}
    {one.lockTime && <HoldingSectionTimelock>until {one.lockTime}</HoldingSectionTimelock>}
  </HoldingSectionValueCoin>
);

const TransferEmbed = ({ holdingSections }: TransferEmbedProps) => {
  const tokenInfo = useSelector(selectCurrentTokenInfo);
  const currentBalance = useSelector(selectCurrentTokenBalance);
  const isNFT = tokenInfo && tokenInfo.supply === 1;
  const isToken = tokenInfo && tokenInfo.supply;
  const sections = holdingSections ?? [{ label: 'holdings', value: currentBalance }];

  return (
    <EmbedContentContainer>
      <Holdings>
        {!isToken ? (
          sections.map(section => (
            <HoldingSectionRow key={section.label}>
              <HoldingSection style={{ width: '30px' }}>
                <div>
                  <img src={icons[section.icon]} alt="section-icon" />
                </div>
              </HoldingSection>
              <HoldingSection>
                <HoldingSectionLabelCoin>{section.label}</HoldingSectionLabelCoin>
                {Array.isArray(section.value)
                  ? section.value.map(one => renderValue(one))
                  : renderValue(section)}
              </HoldingSection>
              {section.label === 'Spendable' && (
                <MarginedButton
                  onClick={openSendModal({ type: ResourceType.TOKEL })}
                  theme={Colors.TRANSPARENT}
                >
                  Send
                </MarginedButton>
              )}
            </HoldingSectionRow>
          ))
        ) : isNFT ? (
          <HoldingsNFTMessage>This is an NFT. You own the only one!</HoldingsNFTMessage>
        ) : (
          sections.map(section => (
            <HoldingSection key={section.label}>
              <HoldingSectionLabel>{section.label}</HoldingSectionLabel>
              <HoldingSectionValue>{processPossibleBN(section.value)}</HoldingSectionValue>
            </HoldingSection>
          ))
        )}
      </Holdings>
    </EmbedContentContainer>
  );
};

export default TransferEmbed;
