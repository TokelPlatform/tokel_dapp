import React from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';
import Tippy from '@tippyjs/react';

import InfoIcon from 'assets/HelperInfoCircle.svg';
import times from 'assets/times.svg';
import { dispatch } from 'store/rematch';
import { selectTokenDetails } from 'store/selectors';
import links from 'util/links';
import { V } from 'util/theming';
import { OrderDetailLite } from 'util/token-types';
import { ModalName, TICKER } from 'vars/defines';

import Icon from 'components/_General/_UIElements/Icon';
import ExplorerLink from 'components/_General/ExplorerLink';
import { Column, Columns } from 'components/_General/Grid';
import OpenInExplorer from 'components/_General/OpenInExplorer';
import TokenMediaDisplay from 'components/_General/TokenMediaDisplay';

const orderIDExplainer =
  "This identifies the order in the blockchain. It's not the same as the token ID of the asset you're buying or selling. You can send this order ID to someone and they can fulfill the order and complete the trade.";

const ActiveOrderWidget = ({ order }: { order: OrderDetailLite }) => {
  const tokenDetails = useSelector(selectTokenDetails);

  const handleCancelOrder = () => {
    dispatch.environment.SET_MODAL({
      name: ModalName.CONFIRM_CANCEL_MARKET_ORDER,
      options: { order },
    });
  };

  return (
    <div
      css={css`
        background-color: ${V.color.backSoftest};
        border-radius: ${V.size.borderRadius};
        margin-bottom: 25px;
        padding-left: 15px;
        padding-right: 15px;

        p {
          margin: 0;
        }
      `}
    >
      <Columns multiline>
        {!!tokenDetails[order.tokenid]?.dataAsJson?.url && (
          <Column
            size={2}
            css={css`
              height: 50px;
            `}
          >
            <TokenMediaDisplay url={tokenDetails[order.tokenid]?.dataAsJson?.url} />
          </Column>
        )}
        <Column size={tokenDetails[order.tokenid]?.dataAsJson?.url ? 8 : 10}>
          <p
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <span
              css={css`
                text-transform: uppercase;
                color: ${order.funcid === 's' ? V.color.danger : V.color.success};
                font-weight: bold;
                font-size: 20px;
              `}
            >
              {order.funcid === 's' ? 'SELL' : 'BUY'}
            </span>
            <span
              css={css`
                margin-left: 8px;
                margin-right: 8px;
                font-size: 20px;
                overflow-x: hidden;
                text-overflow: ellipsis;

                ${!tokenDetails[order.tokenid] &&
                `
                  height: 20px;
                  width: 140px;
                  background-color: ${V.color.back};
                  border-radius: ${V.size.borderRadius};
                `}
              `}
            >
              {tokenDetails[order.tokenid]?.name}
            </span>
            <OpenInExplorer inline link={links.explorers[TICKER](`tokens/${order.tokenid}`)} />
          </p>
          <p
            css={css`
              color: ${V.color.frontSoft};
            `}
          >
            {order.funcid === 's'
              ? `${order.askamount} units x ${order.price} ${TICKER} = ${order.totalrequired} ${TICKER}`
              : `${order.totalrequired} units x ${order.price} ${TICKER} = ${order.bidamount} ${TICKER}`}
          </p>
        </Column>
        <Column size={2}>
          <Icon
            icon={times}
            color="front"
            width={15}
            onClick={handleCancelOrder}
            css={css`
              margin-left: auto;
              cursor: pointer;
            `}
          />
        </Column>
        <Column size={12}>
          <label
            css={css`
              font-size: ${V.font.pSmall};
              color: ${V.color?.frontOp[50]};
              display: flex;
              align-items: center;
              margin-bottom: 2px;

              ${Icon} {
                margin-left: 5px;
              }
            `}
          >
            Order ID
            <Tippy content={orderIDExplainer} arrow>
              <Icon icon={InfoIcon} color="gradient" width={12} height={12} className="icon" />
            </Tippy>
          </label>
          <ExplorerLink txid={order.txid} noLink />
        </Column>
      </Columns>
    </div>
  );
};

export default ActiveOrderWidget;
