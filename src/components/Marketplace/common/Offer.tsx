import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { selectTokenDetails } from 'store/selectors';
import links from 'util/links';
import { V } from 'util/theming';
import { OrderDetailLite } from 'util/token-types';
import { TICKER } from 'vars/defines';

import { ButtonSmall } from 'components/_General/buttons';
import { Column, Columns } from 'components/_General/Grid';
import OpenInExplorer from 'components/_General/OpenInExplorer';
import TokenMediaDisplay from 'components/_General/TokenMediaDisplay';
import ViewContext, { MARKETPLACE_VIEWS } from './ViewContext';

const PricingParagraph = styled.p`
  display: flex;
  align-items: center;
  & > * {
    margin-right: 6px;
    font-size: 20px;
  }
`;

const OfferWidget = ({ order }: { order: OrderDetailLite }) => {
  const tokenDetails = useSelector(selectTokenDetails);
  const { setCurrentView, setCurrentOrderId } = useContext(ViewContext);

  const handleReviewOffer = () => {
    setCurrentOrderId(order.txid);
    setCurrentView(MARKETPLACE_VIEWS.FILL);
  };

  return (
    <div
      css={css`
        background-color: ${V.color.backSoftest};
        border-radius: ${V.size.borderRadius};
        margin-bottom: 25px;
        padding: 15px;

        p {
          margin: 0;
        }
      `}
    >
      <Columns>
        <Column size={3}>
          <TokenMediaDisplay url={tokenDetails[order.tokenid]?.dataAsJson?.url} />
        </Column>
        <Column size={9}>
          <div
            css={css`
              display: flex;
              align-items: baseline;
            `}
          >
            <p
              css={css`
                && {
                  margin-bottom: 8px;
                  margin-right: 8px;
                  font-size: 20px;
                  white-space: nowrap;
                  overflow-x: hidden;
                  text-overflow: ellipsis;
                }
              `}
            >
              {tokenDetails[order.tokenid]?.name}
            </p>
            <OpenInExplorer inline link={links.explorers[TICKER](`tokens/${order.tokenid}$`)} />
          </div>
          <PricingParagraph>
            <span
              css={css`
                text-transform: uppercase;
                color: ${V.color.danger};
                font-weight: bold;
              `}
            >
              SELL
            </span>
            <span>{order.totalrequired}</span>
            <span
              css={css`
                color: ${V.color.frontSoft};
              `}
            >
              {order.totalrequired === 1 ? 'unit for' : 'units for'}
            </span>
            <span>
              {order.price} {TICKER}
            </span>
            {order.totalrequired > 1 && (
              <span
                css={css`
                  color: ${V.color.frontSoft};
                `}
              >
                each
              </span>
            )}
          </PricingParagraph>
          <PricingParagraph>
            <span>
              {order.bidamount} {TICKER}
            </span>
            <span
              css={css`
                color: ${V.color.frontSoft};
              `}
            >
              total
            </span>
          </PricingParagraph>
          <p
            css={css`
              && {
                color: ${V.color.frontSoft};
                margin-bottom: 15px;
                margin-top: 5px;
              }
            `}
          >
            <span>Bid by </span>
            <span
              css={css`
                color: ${V.color.front};
                text-decoration: underline;
              `}
            >
              {order.origaddress}
            </span>
          </p>
          <ButtonSmall theme="danger" onClick={handleReviewOffer}>
            Review bid
          </ButtonSmall>
        </Column>
      </Columns>
    </div>
  );
};

export default OfferWidget;
