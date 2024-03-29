import React from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';

import { selectAllMyOffers, selectMyTokenDetails } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';

import { Box, SubTitle, Title } from 'components/_General/_UIElements/common';
import { Column, Columns } from 'components/_General/Grid';
import Offer from 'components/Marketplace/common/Offer';

const MyOffersWidget: React.FC = () => {
  const allMyOffers = useSelector(selectAllMyOffers);
  const myTokensDetails = useSelector(selectMyTokenDetails);

  React.useEffect(() => {
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
        <Column size={8}>
          <Box>
            <Title>Offers on my assets</Title>
            {allMyOffers?.length === 0 ? (
              <SubTitle>No open orders found</SubTitle>
            ) : (
              <div
                css={css`
                  overflow: auto;
                  padding-top: 12px;
                  max-height: 90%;
                `}
              >
                {allMyOffers.map(offer => (
                  <Offer order={offer} key={offer.txid} />
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
