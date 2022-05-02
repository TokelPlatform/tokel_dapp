import React from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';

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
        <Column size={10}>
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
            {order.bidamount || order.askamount} x {order.price} {TICKER} = {order.totalrequired}{' '}
            {TICKER}
          </p>
        </Column>
        <Column>
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
          <ExplorerLink txid={order.txid} />
        </Column>
      </Columns>
    </div>
  );
};

export default ActiveOrderWidget;
