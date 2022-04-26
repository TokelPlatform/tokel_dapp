import React from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';

import { dispatch } from 'store/rematch';
import { selectModalOptions, selectTokenDetails } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { OrderDetailLite } from 'util/token-types';
import { Colors, FEE, ModalName, TICKER } from 'vars/defines';

import { CenteredButtonWrapper } from 'components/_General/_UIElements/common';
import { Button } from 'components/_General/buttons';
import { Column, Columns } from 'components/_General/Grid';
import AssetWidget from './common/AssetWidget';
import KeyValueDisplay from './common/KeyValueDisplay';

interface ConfirmOrderCancelModalProps {}

const ConfirmOrderCancelModal: React.FC<ConfirmOrderCancelModalProps> = () => {
  const { order } = useSelector(selectModalOptions) as { order: OrderDetailLite };
  const tokenDetails = useSelector(selectTokenDetails);
  const currentTokenDetails = tokenDetails[order.tokenid];

  const handleCancelOrder = () => {
    sendToBitgo(
      order.funcid === 's' ? BitgoAction.ASSET_V2_CANCEL_ASK : BitgoAction.ASSET_V2_CANCEL_BID,
      { tokenId: order.tokenid, orderId: order.txid }
    );

    dispatch.environment.SET_MODAL({
      name: ModalName.MARKET_ORDER_SENT,
      options: {
        isCancelling: true,
        token: currentTokenDetails,
      },
    });
  };

  return (
    <div
      css={css`
        padding-left: 90px;
        padding-right: 90px;
      `}
    >
      <KeyValueDisplay>
        <label>Asset</label>
        <AssetWidget asset={currentTokenDetails} />
      </KeyValueDisplay>

      <Columns multiline>
        <Column size={12}>
          <KeyValueDisplay>
            <label>Order ID</label>
            <p>{order.txid}</p>
          </KeyValueDisplay>
        </Column>

        <Column size={3}>
          <KeyValueDisplay color={order.funcid === 'b' ? Colors.SUCCESS : Colors.DANGER}>
            <label>Order Type</label>
            <p>{order.funcid === 'b' ? 'Bid (Purchase)' : 'Ask (Sale)'}</p>
          </KeyValueDisplay>
        </Column>

        <Column size={3}>
          <KeyValueDisplay>
            <label>Amount</label>
            <p>{order.askamount || order.bidamount}</p>
          </KeyValueDisplay>
        </Column>
        <Column size={3}>
          <KeyValueDisplay>
            <label>Unit Price</label>
            <p>
              {order.price} {TICKER}
            </p>
          </KeyValueDisplay>
        </Column>

        <Column size={3}>
          <KeyValueDisplay>
            <label>Total</label>
            <p>
              {order.totalrequired} {TICKER}
            </p>
          </KeyValueDisplay>
        </Column>
      </Columns>

      <CenteredButtonWrapper onClick={handleCancelOrder}>
        <Button theme="purple">Cancel Order</Button>

        <small
          css={css`
            margin-top: 10px;
          `}
        >
          Cancelling this order will incur a transaction fee of {FEE} {TICKER}
        </small>
      </CenteredButtonWrapper>
    </div>
  );
};

export default ConfirmOrderCancelModal;
