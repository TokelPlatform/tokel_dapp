import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import BN from 'bn.js';
import * as yup from 'yup';

import { selectTokenBalances, selectTokenDetails, selectUnspentBalance } from 'store/selectors';
import { parseBigNumObject } from 'util/helpers';
import { FEE, TICKER } from 'vars/defines';

const useFulfillOrderSchema = (type: 'fill' | 'ask' | 'bid') => {
  const balance = useSelector(selectUnspentBalance);
  const myTokensBalances = useSelector(selectTokenBalances);
  const tokenDetails = useSelector(selectTokenDetails);

  const schema = useMemo(
    () =>
      yup.object().shape({
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
          .test(
            'token-is-present',
            'token for this order not present in your wallet',
            (_, context) =>
              context.parent.order?.type === 'bid'
                ? myTokensBalances[context.parent.order?.token?.tokenid] !== undefined
                : true
          )
          // let user know that fillasks for tokens with > 50% royalty will faill
          .test(
            'token-has-problematic-royalty',
            'token has > 50% royalty, order will fail',
            (_, context) =>
              type === 'fill' && context.parent.order?.type === 'ask'
                ? tokenDetails[context.parent.order?.token?.tokenid]?.dataAsJson?.royalty <= 500
                : true
          ),
        quantity: yup
          .number()
          .min(1, 'quantity must be greater than 0')
          .required('quantity is required')
          .test('order-amount', "can't exceed order amount", (value, context) =>
            type === 'fill'
              ? new BN(value).lte(parseBigNumObject(context.parent.order?.bnAmount))
              : true
          )
          .test('enough-balance', 'not enough tokens in wallet', (value, context) =>
            type === 'ask'
              ? new BN(value).lte(parseBigNumObject(myTokensBalances[context.parent.assetId]))
              : true
          )
          .test('max-supply', 'not enough supply of this token', (value, context) =>
            type === 'bid' ? value <= tokenDetails?.[context.parent.assetId]?.supply : true
          )
          .required('quantity is required'),
        price: yup
          .number()
          .positive()
          .min(0.00000001, 'price must be greater than 1 satoshi')
          .required('price is required')
          .test('needs-funds', `not enough ${TICKER}`, (value, context) =>
            (type === 'fill' || type === 'bid') && context.parent.quantity > 0
              ? value <= (balance - FEE) / context.parent.quantity
              : true
          ),
      }),
    [balance, myTokensBalances, tokenDetails, type]
  );

  return schema;
};

export default useFulfillOrderSchema;
