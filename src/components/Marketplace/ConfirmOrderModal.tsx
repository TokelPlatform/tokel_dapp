import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectModalOptions, selectOrderDetails, selectTokenDetails } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { V } from 'util/theming';
import { Colors, FEE, ModalName, TICKER } from 'vars/defines';

import { CenteredButtonWrapper } from 'components/_General/_UIElements/common';
import { Button } from 'components/_General/buttons';
import { Column, Columns } from 'components/_General/Grid';
import WarningCritical from 'components/_General/WarningCritical';
import AssetWidget from './common/AssetWidget';
import KeyValueDisplay from './common/KeyValueDisplay';

const WarningWrapper = styled.div`
  margin-top: 15px;
  padding: 18px;
  border-radius: ${V.size.borderRadius};
  background-color: ${V.color.backHard};
  margin-bottom: 20px;

  & > [WarningCritical] {
    margin-bottom: none;
  }
`;

const ConfirmOrderModal: React.FC = () => {
  const formValues = useSelector(selectModalOptions) as Record<string, unknown>;
  const orderDetails = useSelector(selectOrderDetails);
  const tokenDetails = useSelector(selectTokenDetails);

  const currentOrderDetails = orderDetails?.[formValues?.orderId as string];
  const currentOrderType = currentOrderDetails?.type;
  const currentTokenDetails =
    currentOrderDetails?.token || tokenDetails?.[formValues?.assetId as string];
  const isFilling = formValues?.type === 'fill';

  const handleOrderBroadcast = () => {
    if (formValues?.type === 'fill') {
      sendToBitgo(
        currentOrderType === 'bid' ? BitgoAction.ASSET_V2_FILL_BID : BitgoAction.ASSET_V2_FILL_ASK,
        {
          orderId: formValues?.orderId as string,
          tokenId: formValues.assetId as string,
          amount: formValues.quantity as number,
        }
      );
    } else {
      sendToBitgo(
        formValues?.type === 'bid' ? BitgoAction.ASSET_V2_POST_BID : BitgoAction.ASSET_V2_POST_ASK,
        {
          tokenId: formValues.assetId as string,
          amount: formValues.quantity as number,
          unitPrice: formValues.price as number,
        }
      );
    }

    dispatch.environment.SET_MODAL({
      name: ModalName.MARKET_ORDER_SENT,
      options: {
        isFilling,
        token: currentTokenDetails,
      },
    });
  };

  const orderSide = useMemo(
    () => (isFilling ? currentOrderType : formValues?.type),
    [formValues?.type, isFilling, currentOrderType]
  );

  const myOrderSide = useMemo(() => {
    if (formValues?.type === 'bid' || (isFilling && currentOrderType === 'ask')) {
      return 'bid';
    }
    return 'ask';
  }, [formValues?.type, isFilling, currentOrderType]);

  const calculatedCostOrProceeds = useMemo(() => {
    const total = (formValues.price as number) * (formValues.quantity as number);
    const royalty = currentTokenDetails?.dataAsJson?.royalty / 10 || 0;

    return myOrderSide === 'bid'
      ? (total + FEE).toFixed(8)
      : (total - (total * royalty) / 100 - FEE).toFixed(8);
  }, [formValues.price, formValues.quantity, myOrderSide, currentTokenDetails]);

  const buttonTheme = useMemo(
    () => (myOrderSide === 'bid' ? Colors.SUCCESS : Colors.DANGER),
    [myOrderSide]
  );

  const buttonLabel =
    formValues.type === 'ask'
      ? 'Post sell order'
      : formValues.type === 'bid'
      ? 'Post bid order'
      : currentOrderType === 'ask'
      ? 'Confirm purchase'
      : currentOrderType === 'bid'
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
        <span>Asset</span>
        <AssetWidget asset={currentTokenDetails} />
      </KeyValueDisplay>

      <Columns
        gapless
        multiline
        css={css`
          margin-bottom: 0 !important;
        `}
      >
        <Column size={3}>
          <KeyValueDisplay color={orderSide === 'bid' ? Colors.SUCCESS : Colors.DANGER}>
            <span>Order Type</span>
            <p>{orderSide === 'bid' ? 'Bid (Purchase)' : 'Ask (Sale)'}</p>
          </KeyValueDisplay>
        </Column>

        {Boolean(formValues.orderId) && (
          <Column size={9}>
            <KeyValueDisplay>
              <span>Order ID</span>
              <p>{formValues.orderId}</p>
            </KeyValueDisplay>
          </Column>
        )}

        <Column size={isFilling ? 4 : 3}>
          <KeyValueDisplay>
            <span>Amount</span>
            <p>{formValues.quantity}</p>
          </KeyValueDisplay>
        </Column>

        <Column size={isFilling ? 4 : 3}>
          <KeyValueDisplay>
            <span>Unit Price</span>
            <p>
              {formValues.price} {TICKER}
            </p>
          </KeyValueDisplay>
        </Column>

        <Column size={isFilling ? 4 : 3}>
          <KeyValueDisplay>
            <span>Total</span>
            <p>
              {(formValues.price as number) * (formValues.quantity as number)} {TICKER}
            </p>
          </KeyValueDisplay>
        </Column>

        <Column size={4}>
          <KeyValueDisplay>
            <span>Royalty</span>
            <p>
              {currentTokenDetails?.dataAsJson?.royalty / 10 || 0}% {TICKER}
            </p>
          </KeyValueDisplay>
        </Column>

        <Column size={4}>
          <KeyValueDisplay>
            <span>Transaction Fee</span>
            <p>
              {FEE} {TICKER}
            </p>
          </KeyValueDisplay>
        </Column>

        <Column size={4}>
          {myOrderSide === 'bid' && (
            <KeyValueDisplay color={Colors.DANGER}>
              <>
                <span>Total Cost</span>
                <p>
                  {calculatedCostOrProceeds} {TICKER}
                </p>
              </>
            </KeyValueDisplay>
          )}

          {myOrderSide === 'ask' && (
            <KeyValueDisplay color={Colors.SUCCESS}>
              <>
                <span>Total Proceeds</span>
                <p>
                  {calculatedCostOrProceeds} {TICKER}
                </p>
              </>
            </KeyValueDisplay>
          )}
        </Column>
      </Columns>

      {!isFilling && (
        <WarningWrapper>
          <WarningCritical
            title=""
            subtitle={[
              'The transaction fee will immediately be charged to broadcast the order. Upon broadcasting, the assets or coins involved will be sent to a global address and will leave your wallet temporarily until the order is filled or cancelled.',
            ]}
          />
        </WarningWrapper>
      )}

      <CenteredButtonWrapper onClick={handleOrderBroadcast}>
        <Button theme={buttonTheme}>{buttonLabel}</Button>
      </CenteredButtonWrapper>
    </div>
  );
};

export default ConfirmOrderModal;
