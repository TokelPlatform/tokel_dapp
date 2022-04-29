import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';

import { selectTokenDetails } from 'store/selectors';
import links from 'util/links';
import { V } from 'util/theming';
import { OrderDetailLite } from 'util/token-types';
import { TICKER } from 'vars/defines';

import { ButtonSmall } from 'components/_General/buttons';
import OpenInExplorer from 'components/_General/OpenInExplorer';
import ViewContext, { MARKETPLACE_VIEWS } from './ViewContext';

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
      <p
        css={css`
          && {
            margin-bottom: 8px;
          }
        `}
      >
        <span
          css={css`
            margin-right: 8px;
            font-size: 20px;
          `}
        >
          {tokenDetails[order.tokenid]?.name}
        </span>
        <OpenInExplorer inline link={links.explorers[TICKER](`tokens/${order.tokenid}$`)} />
      </p>
      <p
        css={css`
          display: flex;
          align-items: center;
          & > * {
            margin-right: 6px;
            font-size: 20px;
          }
        `}
      >
        <span
          css={css`
            text-transform: uppercase;
            color: ${V.color.danger};
            font-weight: bold;
          `}
        >
          SELL
        </span>
        {order.bidamount === 1 ? (
          <>
            <span>{order.bidamount}</span>
            <span
              css={css`
                color: ${V.color.frontSoft};
              `}
            >
              unit for
            </span>
            <span>
              {order.totalrequired} {TICKER}
            </span>
          </>
        ) : (
          <>
            <span>{order.bidamount}</span>
            <span
              css={css`
                color: ${V.color.frontSoft};
              `}
            >
              units for
            </span>
            <span>
              {order.price} {TICKER}
            </span>
            <span
              css={css`
                color: ${V.color.frontSoft};
              `}
            >
              each,
            </span>
            <span>
              {order.totalrequired} {TICKER}
            </span>
            <span
              css={css`
                color: ${V.color.frontSoft};
              `}
            >
              total
            </span>
          </>
        )}
      </p>
      <p
        css={css`
          && {
            color: ${V.color.frontSoft};
            margin-bottom: 15px;
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
    </div>
  );
};

export default OfferWidget;
