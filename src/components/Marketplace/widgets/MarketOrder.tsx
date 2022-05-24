import React, { useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';
import { Form, FormikProvider, useFormik } from 'formik';
import { toBitcoin } from 'satoshi-bitcoin';

import useDebounce from 'hooks/useDebounce';
import useMyTokens from 'hooks/useMyTokens';
import { dispatch } from 'store/rematch';
import { selectOrderDetails, selectTokenDetails } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { parseBigNumObject } from 'util/helpers';
import { V } from 'util/theming';
import useFulfillOrderSchema from 'util/validators/useMarketOrderSchema';
import { Colors, ModalName, TICKER } from 'vars/defines';

import Field from 'components/_General/_FormikElements/Field';
import Select from 'components/_General/_FormikElements/Select';
import { Box, CenteredButtonWrapper } from 'components/_General/_UIElements/common';
import { Button } from 'components/_General/buttons';
import { Column, Columns } from 'components/_General/Grid';
import AssetWidget from '../common/AssetWidget';
import ViewContext from '../common/ViewContext';

const initialValues = {
  orderId: '',
  assetId: '',
  quantity: 0,
  price: '',
};

interface MarketOrderWidgetProps {
  type: 'ask' | 'bid' | 'fill';
}

type MarketOrder = {
  assetId?: string;
  orderId?: string;
  quantity: number;
  price: string;
};

const MarketOrderWidget: React.FC<MarketOrderWidgetProps> = ({ type }) => {
  const orderDetails = useSelector(selectOrderDetails);
  const tokenDetails = useSelector(selectTokenDetails);
  const myTokens = useMyTokens();
  const fulfillOrderSchema = useFulfillOrderSchema(type);
  const { currentOrderId: prefillOrderId, setCurrentOrderId: setPrefillOrderId } =
    useContext(ViewContext);

  const handleMarketOrder = (values: MarketOrder, { setSubmitting }) => {
    setSubmitting(false);
    dispatch.environment.SET_MODAL({
      name: ModalName.CONFIRM_MARKET_ORDER,
      options: { type, ...{ ...values, price: parseFloat(values.price) } },
    });
  };

  const formikBag = useFormik<Partial<MarketOrder>>({
    validationSchema: fulfillOrderSchema,
    initialValues,
    onSubmit: handleMarketOrder,
  });

  const debouncedOrderId = useDebounce(formikBag.values.orderId, 1000);
  const debouncedAssetId = useDebounce(formikBag.values.assetId, 1000);
  const currentOrderDetails = useMemo(
    () => orderDetails?.[formikBag.values.orderId] || orderDetails?.[formikBag.values.assetId],
    [orderDetails, formikBag.values.orderId, formikBag.values.assetId]
  );
  const currentTokenDetails =
    currentOrderDetails?.token || tokenDetails?.[formikBag.values.assetId];

  const buttonTheme = useMemo(() => {
    if (type === 'bid' || (type === 'fill' && currentOrderDetails?.type === 'ask')) {
      return Colors.SUCCESS;
    }
    if (type === 'ask' || (type === 'fill' && currentOrderDetails?.type === 'bid')) {
      return Colors.DANGER;
    }
    return Colors.PURPLE;
  }, [type, currentOrderDetails]);

  const title = type === 'ask' ? 'Sell order' : type === 'bid' ? 'Bid Order' : 'Fill Order';
  const subTitle =
    type === 'ask'
      ? 'Put a token up for sale.'
      : type === 'bid'
      ? 'Place a bid on a token order using a token ID. You can get the token ID at the token details in the explorer'
      : 'Use this form to fill an order. You can either fill a buy order (sell your token/NFT), or fill a sell order (buy someone elses token/NFT).';
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
    if (prefillOrderId) formikBag.setFieldValue('orderId', prefillOrderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillOrderId, formikBag.setFieldValue]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => setPrefillOrderId(undefined), []);

  useEffect(() => {
    if (currentOrderDetails) {
      const quantity = parseBigNumObject(currentOrderDetails.bnAmount).toNumber();
      const price = toBitcoin(parseBigNumObject(currentOrderDetails.bnUnitPrice).toNumber());

      const values = {
        ...formikBag.values,
        ...{
          order: currentOrderDetails,
          orderId: currentOrderDetails?.orderid,
          assetId: currentOrderDetails?.token.tokenid,
          price: type === 'fill' ? `${price}` : undefined,
          quantity:
            type === 'fill' ? (currentOrderDetails?.token?.supply === 1 ? 1 : quantity) : undefined,
        },
      };

      formikBag.setFormikState({
        ...formikBag,
        values,
        touched: {
          orderId: true,
          assetId: true,
          price: type === 'fill',
          quantity: type === 'fill',
        },
      });

      formikBag.validateForm(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentOrderDetails,
    formikBag.setFieldValue,
    formikBag.validateForm,
    formikBag.setFormikState,
  ]);

  useEffect(() => {
    if (
      !currentOrderDetails &&
      currentTokenDetails?.supply === 1 &&
      formikBag.values.quantity !== 1
    ) {
      formikBag.setFieldValue('quantity', 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formikBag.setFieldValue,
    formikBag.values.quantity,
    currentTokenDetails,
    currentOrderDetails,
  ]);

  useEffect(() => {
    if (debouncedOrderId?.length === 64 && !orderDetails?.[debouncedOrderId]) {
      sendToBitgo(BitgoAction.ASSET_V2_FETCH_ORDER_DECODED, {
        orderId: debouncedOrderId,
      });
    }
  }, [debouncedOrderId, orderDetails]);

  useEffect(() => {
    if (debouncedAssetId?.length === 64 && !tokenDetails?.[debouncedAssetId]) {
      sendToBitgo(BitgoAction.TOKEN_V2_INFO_TOKEL, {
        tokenId: debouncedAssetId,
      });

      // User might be confusing order ID with asset ID. Query blockchain just in case
      if (type === 'bid') {
        sendToBitgo(BitgoAction.ASSET_V2_FETCH_ORDER_DECODED, {
          orderId: debouncedAssetId,
        });
      }
    }
  }, [debouncedAssetId, tokenDetails, type]);

  useEffect(() => {
    if (formikBag.values.orderId?.length !== 64) {
      formikBag.setFieldValue('order', {});
      formikBag.setFieldValue('quantity', 0);
      formikBag.setFieldValue('price', 0);
      formikBag.setFieldValue('assetId', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikBag.setFieldValue, formikBag.values.orderId]);

  return (
    <Box
      css={css`
        padding-left: 5em;
        padding-right: 5em;
        padding-top: 2.5em;
        padding-bottom: 2.5em;
      `}
    >
      <h3 style={{ marginBottom: '4px' }}>{title}</h3>
      <h5 style={{ fontWeight: 400, marginTop: 0, color: `${V.color.frontSoft}` }}>{subTitle}</h5>
      <FormikProvider value={formikBag}>
        <Form>
          {type === 'fill' && (
            <Field
              name="orderId"
              type="textarea"
              placeholder="Paste an ask or bid ID to fill"
              label="Order ID"
              help="If someone has sent you an order ID, you may paste it here to see further information and fulfill it"
            />
          )}

          {type === 'ask' && (
            <Select
              name="assetId"
              type="textarea"
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
              type="textarea"
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
                readOnly={currentTokenDetails?.supply === 1}
                placeholder="100,000"
                min={1}
                help="Number of tokens to include in this order. Always one for NFTs."
              />
            </Column>
            <Column size={7}>
              <Field
                name="price"
                type="text"
                label="Price per unit"
                placeholder="0"
                help="The price per unit of this asset for this order. Multiply this value by the quantity to get the total price."
                disabled={type === 'fill'}
                appendLight
                append={TICKER}
              />
            </Column>
          </Columns>

          <AssetWidget asset={currentTokenDetails} />

          <CenteredButtonWrapper
            css={css`
              margin-top: 15px;
            `}
          >
            <Button
              theme={buttonTheme}
              disabled={!formikBag.isValid}
              loading={
                formikBag.isValidating ||
                (debouncedOrderId !== formikBag.values.orderId && !currentOrderDetails) ||
                (debouncedAssetId !== formikBag.values.assetId && !currentTokenDetails)
              }
            >
              {buttonLabel}
            </Button>
          </CenteredButtonWrapper>
        </Form>
      </FormikProvider>
    </Box>
  );
};

export default MarketOrderWidget;
