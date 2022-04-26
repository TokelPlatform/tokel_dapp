import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';

import { selectAllMyOffers, selectMyTokenDetails } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';

import { Box, SubTitle, Title } from 'components/_General/_UIElements/common';
import { Column, Columns } from 'components/_General/Grid';
import Offer from 'components/Marketplace/common/Offer';

interface MyOffersWidgetProps {}

const MyOffersWidget: React.FC<MyOffersWidgetProps> = () => {
  const allMyOffers = useSelector(selectAllMyOffers);
  const myTokensDetails = useSelector(selectMyTokenDetails);

  console.log(allMyOffers);

  useEffect(() => {
    Object.keys(myTokensDetails).forEach(tokenId => {
      sendToBitgo(BitgoAction.TOKEN_V2_ORDERS, { tokenId });
    });
    // We want to run this only on mount to prevent an infinite loop, so we use an empty array as a dependency
    // eslint-disable-next-line
  }, []);

  return (
    <Column
      size={12}
      css={css`
        padding: 20px 0px 0px;
      `}
    >
      <Columns
        css={css`
          height: 100%;
          padding: 0 !important;
        `}
      >
        <Column size={6}>
          <Box>
            <Title>Offers on my assets</Title>
            {allMyOffers?.length === 0 ? (
              <SubTitle>No open orders found</SubTitle>
            ) : (
              <div
                css={css`
                  overflow: scroll;
                  padding-top: 12px;
                  max-height: 90%;
                `}
              >
                {allMyOffers.map((offer, index) => (
                  <Offer order={offer} key={index} />
                ))}
              </div>
            )}
          </Box>
        </Column>
      </Columns>
    </Column>
  );
};

export default MyOffersWidget;
