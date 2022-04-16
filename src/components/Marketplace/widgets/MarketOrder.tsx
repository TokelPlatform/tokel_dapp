import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';
import { Form, FormikProvider, useFormik } from 'formik';
import { toBitcoin } from 'satoshi-bitcoin';

import useDebounce from 'hooks/useDebounce';
import useMyTokens from 'hooks/useMyTokens';
import { selectOrderDetails, selectTokenDetails } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { parseBigNumObject } from 'util/helpers';
import useFulfillOrderSchema from 'util/validators/useMarketOrderSchema';
import { Colors, TICKER } from 'vars/defines';

import Field from 'components/_General/_FormikElements/Field';
import Select from 'components/_General/_FormikElements/Select';
import { Box, CenteredButtonWrapper } from 'components/_General/_UIElements/common';
import { Button } from 'components/_General/buttons';
import { Column, Columns } from 'components/_General/Grid';
import AssetWidget from '../common/AssetWidget';

const initialValues = {};

interface MarketOrderWidgetProps {
  type: 'ask' | 'bid' | 'fill';
}

type MarketOrder = {
  assetId?: string;
  orderId?: string;
  quantity: number;
  price: number;
};

const MarketOrderWidget: React.FC<MarketOrderWidgetProps> = ({ type }) => {
  const orderDetails = useSelector(selectOrderDetails);
  const tokenDetails = useSelector(selectTokenDetails);
  const myTokens = useMyTokens();
  const fulfillOrderSchema = useFulfillOrderSchema(type);

  const handleMarketOrder = (_, { setSubmitting }) => {
    setSubmitting(false);
    // dispatch.environment.SET_MODAL({
    //   name: ModalName.CONFIRM_TOKEN_CREATION,
    //   options: { ...values, confirmation: false },
    // });
  };

  const formikBag = useFormik<Partial<MarketOrder>>({
    validationSchema: fulfillOrderSchema,
    initialValues,
    onSubmit: handleMarketOrder,
  });

  const debouncedOrderId = useDebounce(formikBag.values.orderId, 1000);
  const debouncedAssetId = useDebounce(formikBag.values.assetId, 1000);
  const currentOrderDetails = orderDetails?.[debouncedOrderId];

  const buttonTheme = useMemo(() => {
    if (type === 'bid' || (type === 'fill' && currentOrderDetails?.type === 'ask')) {
      return Colors.SUCCESS;
    } else if (type === 'ask' || (type === 'fill' && currentOrderDetails?.type === 'bid')) {
      return Colors.DANGER;
    } else {
      return Colors.PURPLE;
    }
  }, [type, currentOrderDetails]);

  const buttonLabel =
    type === 'ask'
      ? 'Review sell order'
      : type === 'bid'
      ? 'Review bid order'
      : currentOrderDetails?.type === 'ask'
      ? 'Review purchase'
      : currentOrderDetails?.type === 'bid'
      ? 'Review sale'
      : 'Review order';

  useEffect(() => {
    if (currentOrderDetails) {
      formikBag.setFieldValue('order', currentOrderDetails);
      formikBag.setFieldValue('assetId', currentOrderDetails.token.tokenid);
      formikBag.setFieldValue(
        'quantity',
        parseBigNumObject(currentOrderDetails.bnAmount).toNumber()
      );
      formikBag.setFieldValue(
        'price',
        toBitcoin(parseBigNumObject(currentOrderDetails.bnUnitPrice).toNumber())
      );

      if (type === 'fill') {
        formikBag.setFieldTouched('quantity', true);
        formikBag.setFieldTouched('price', true);
      }
    }
  }, [formikBag.setFieldValue, currentOrderDetails]);

  useEffect(() => {
    if (debouncedOrderId?.length === 64 && !orderDetails?.[debouncedOrderId]) {
      sendToBitgo(BitgoAction.ASSET_V2_FETCH_ORDER_DECODED, {
        orderId: debouncedOrderId,
      });
    }
  }, [debouncedOrderId]);

  useEffect(() => {
    if (debouncedAssetId?.length === 64 && !tokenDetails?.[debouncedAssetId]) {
      sendToBitgo(BitgoAction.TOKEN_V2_INFO_TOKEL, {
        tokenId: debouncedAssetId,
      });
    }
  }, [debouncedAssetId]);

  useEffect(() => {
    formikBag.setFieldValue('order', {});
    formikBag.setFieldValue('quantity', undefined);
    formikBag.setFieldValue('price', undefined);
    formikBag.setFieldValue('assetId', undefined);
  }, [formikBag.values.orderId]);

  return (
    <Box
      css={css`
        padding-left: 5em;
        padding-right: 5em;
        padding-top: 2.5em;
        padding-bottom: 2.5em;
      `}
    >
      <FormikProvider value={formikBag}>
        <Form>
          {type === 'fill' && (
            <Field
              name="orderId"
              placeholder="Paste an ask or bid ID to fill"
              label="Order ID"
              help="If someone has sent you an order ID, you may paste it here to see further information and fulfill it"
            />
          )}

          {type === 'ask' && (
            <Select
              name="assetId"
              label="Asset to sell"
              placeholder="Search for an asset you own..."
              options={Object.values(myTokens)}
              help="Select an asset you own and place an order to sell it. You'll receive an order ID you can send to the buyer to complete the order."
              useOptionValueAsFieldValue
            />
          )}

          {type === 'bid' && (
            <Field
              name="assetId"
              placeholder="Paste a asset ID to bid for"
              label="Token ID"
              help="You can get the token or nFT ID by asking the creator, or by navigating in the explorer"
            />
          )}

          <Columns
            gapless
            css={css`
              margin-bottom: 0 !important;
            `}
          >
            <Column size={5}>
              <Field
                name="quantity"
                type="number"
                label="Quantity"
                // readOnly={tokenType === TokenType.NFT}
                placeholder="100,000"
                min={1}
                help="Number of tokens to include in this order. Always one for NFTs."
              />
            </Column>
            <Column size={7}>
              <Field
                name="price"
                type="number"
                label="Price per unit"
                placeholder="0"
                help="The price per unit of this asset for this order. Multiply this value by the quantity to get the total price."
                disabled={type === 'fill'}
                appendLight
                append={TICKER}
              />
            </Column>
          </Columns>

          <AssetWidget
            asset={currentOrderDetails?.token || tokenDetails[formikBag.values.assetId]}
          />

          <CenteredButtonWrapper
            css={css`
              margin-top: 15px;
            `}
          >
            <Button theme={buttonTheme} disabled={!formikBag.isValid}>
              {buttonLabel}
            </Button>
          </CenteredButtonWrapper>
        </Form>
      </FormikProvider>
    </Box>
  );
};

export default MarketOrderWidget;
