import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { toSatoshi } from 'satoshi-bitcoin';

import { selectModalOptions, selectOrderDetails, selectTokenDetails } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { V } from 'util/theming';
import { Colors, FEE, TICKER } from 'vars/defines';

import { CenteredButtonWrapper } from 'components/_General/_UIElements/common';
import { Button } from 'components/_General/buttons';
import { Column, Columns } from 'components/_General/Grid';
import AssetWidget from './common/AssetWidget';

const KeyValueDisplay = styled.div`
  margin-bottom: 15px;

  label {
    color: ${V.color.frontSoft};
    font-weight: bold;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
  }
`;

interface ConfirmOrderModalProps {}

const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = () => {
  const formValues = useSelector(selectModalOptions) as Record<string, any>;
  const orderDetails = useSelector(selectOrderDetails);
  const tokenDetails = useSelector(selectTokenDetails);

  const currentOrderDetails = orderDetails?.[formValues?.orderId];
  const currentTokenDetails = currentOrderDetails?.token || tokenDetails?.[formValues?.assetId];

  const handleOrderBroadcast = () => {
    if (formValues?.type === 'fill') {
      sendToBitgo(
        currentOrderDetails?.type === 'bid'
          ? BitgoAction.ASSET_V2_FILL_BID
          : BitgoAction.ASSET_V2_FILL_ASK,
        {
          orderId: formValues?.orderId,
          tokenId: formValues.assetId,
          amount: formValues.quantity,
          unitPrice: formValues.price,
        }
      );
    } else {
      sendToBitgo(
        formValues?.type === 'bid' ? BitgoAction.ASSET_V2_POST_BID : BitgoAction.ASSET_V2_POST_ASK,
        {
          tokenId: formValues.assetId,
          amount: formValues.quantity,
          unitPrice: formValues.price,
        }
      );
    }
  };

  const buttonTheme = useMemo(() => {
    if (
      formValues.type === 'bid' ||
      (formValues.type === 'fill' && currentOrderDetails?.type === 'ask')
    ) {
      return Colors.SUCCESS;
    } else if (
      formValues.type === 'ask' ||
      (formValues.type === 'fill' && currentOrderDetails?.type === 'bid')
    ) {
      return Colors.DANGER;
    } else {
      return Colors.PURPLE;
    }
  }, [formValues.type, currentOrderDetails]);

  const buttonLabel =
    formValues.type === 'ask'
      ? 'Post sell order'
      : formValues.type === 'bid'
      ? 'Post bid order'
      : currentOrderDetails?.type === 'ask'
      ? 'Confirm purchase'
      : currentOrderDetails?.type === 'bid'
      ? 'Confirm sale'
      : 'Confirm order';

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

      {Boolean(formValues.orderId) && (
        <KeyValueDisplay>
          <label>Order ID</label>
          <p>{formValues.orderId}</p>
        </KeyValueDisplay>
      )}

      <Columns
        gapless
        css={css`
          margin-bottom: 0 !important;
        `}
      >
        <Column size={3}>
          <KeyValueDisplay>
            <label>Order Type</label>
            <p>{formValues.type === 'bid' ? 'Bid (Purchase)' : 'Ask (Sale)'}</p>
          </KeyValueDisplay>
        </Column>
        <Column size={3}>
          <KeyValueDisplay>
            <label>Amount</label>
            <p>{formValues.quantity}</p>
          </KeyValueDisplay>
        </Column>
        <Column size={3}>
          <KeyValueDisplay>
            <label>Unit Price</label>
            <p>
              {formValues.price} {TICKER}
            </p>
          </KeyValueDisplay>
        </Column>
        <Column size={3}>
          <KeyValueDisplay>
            <label>Total</label>
            <p>
              {formValues.price * formValues.quantity} {TICKER}
            </p>
          </KeyValueDisplay>
        </Column>
      </Columns>

      <Columns gapless>
        <Column size={4}>
          <KeyValueDisplay>
            <label>Royalty</label>
            <p>
              {currentTokenDetails?.dataAsJson?.royalty / 10 || 0}% {TICKER}
            </p>
          </KeyValueDisplay>
        </Column>
        <Column size={4}>
          <KeyValueDisplay>
            <label>Transaction Fee</label>
            <p>
              {FEE} {TICKER}
            </p>
          </KeyValueDisplay>
        </Column>
        <Column size={4}>
          <KeyValueDisplay>
            <label>Total Cost</label>
            <p>
              {(formValues.price * formValues.quantity + FEE).toFixed(8)} {TICKER}
            </p>
          </KeyValueDisplay>
        </Column>
      </Columns>

      <CenteredButtonWrapper onClick={handleOrderBroadcast}>
        <Button theme={buttonTheme}>{buttonLabel}</Button>
      </CenteredButtonWrapper>
    </div>
  );
};

export default ConfirmOrderModal;
