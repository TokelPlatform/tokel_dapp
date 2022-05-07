import { useSelector } from 'react-redux';

import BN from 'bn.js';
import * as yup from 'yup';

import {
  selectOrderDetails,
  selectTokenBalances,
  selectTokenDetails,
  selectUnspentBalance,
} from 'store/selectors';
import { parseBigNumObject } from 'util/helpers';
import { FEE, TICKER } from 'vars/defines';

const useFulfillOrderSchema = (type: 'fill' | 'ask' | 'bid') => {
  const orderDetails = useSelector(selectOrderDetails);
  const balance = useSelector(selectUnspentBalance);
  const myTokensBalances = useSelector(selectTokenBalances);
  const tokenDetails = useSelector(selectTokenDetails);

  return yup.object().shape({
    order: yup.object().nullable(),
    assetId: yup
      .string()
      .length(64, 'not a valid token ID')
      .test('not-null-in-bid', 'token ID is required', value =>
        type === 'bid' ? value?.length > 0 : true
      ),
    orderId: yup
      .string()
      .length(64, 'not a valid order ID')
      .test('not-null-in-fill', 'order ID is required', value =>
        type === 'fill' ? value?.length > 0 : true
      )
      .test('token-is-present', 'token for this order not present in your wallet', value =>
        orderDetails[value]?.type === 'bid'
          ? myTokensBalances[orderDetails[value]?.token?.tokenid] !== undefined
          : true
      )
      // let user know that fillasks for tokens with > 50% royalty will faill
      .test('token-has-problematic-royalty', 'token has > 50% royalty, order will fail', value =>
        type === 'fill' && orderDetails[value]?.type === 'ask'
          ? !tokenDetails[orderDetails[value]?.token?.tokenid]?.dataAsJson?.royalty ||
            tokenDetails[orderDetails[value]?.token?.tokenid]?.dataAsJson?.royalty <= 500
          : true
      ),
    quantity: yup
      .number()
      .min(1, 'quantity must be greater than 0')
      .required('quantity is required')
      .test('order-amount', "can't exceed order amount", (value, context) =>
        type === 'fill'
          ? new BN(value).lte(parseBigNumObject(orderDetails[context.parent.orderId]?.bnAmount))
          : true
      )
      .test('enough-balance', 'not enough tokens in wallet', (value, context) =>
        type === 'ask' || (type === 'fill' && orderDetails[context.parent.orderId]?.type === 'bid')
          ? new BN(value).lte(parseBigNumObject(myTokensBalances[context.parent.assetId]))
          : true
      )
      .test('max-supply', 'not enough supply of this token', (value, context) =>
        type === 'bid' ? value <= tokenDetails?.[context.parent.assetId]?.supply : true
      )
      .required('quantity is required'),
    price: yup
      .string()
      .test('postive', 'not a valid price', value => parseFloat(value) > 0)
      .test(
        'min-one-satoshi',
        'price must be greater than 1 satoshi',
        value => parseFloat(value) > 0.00000001
      )
      .required('price is required')
      .test('needs-funds', `not enough ${TICKER}`, (value, context) =>
        (type === 'fill' || type === 'bid') && context.parent.quantity > 0
          ? parseFloat(value) <= (balance - FEE) / context.parent.quantity
          : true
      ),
  });
};

export default useFulfillOrderSchema;
