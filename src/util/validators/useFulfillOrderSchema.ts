import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import * as yup from 'yup';

import { selectTokenBalances, selectUnspentBalance } from 'store/selectors';
import { parseBigNumObject } from 'util/helpers';
import { FEE, TICKER } from 'vars/defines';

const useFulfillOrderSchema = () => {
  const balance = useSelector(selectUnspentBalance);
  const myTokens = useSelector(selectTokenBalances);

  const schema = useMemo(
    () =>
      yup.object().shape({
        order: yup.object(),
        orderId: yup
          .string()
          .length(64, 'not a valid order ID')
          .required('order ID is required')
          .test(
            'token-is-present',
            'token for this order not present in your wallet',
            (_, context) =>
              context.parent.order?.type === 'bid'
                ? myTokens[context.parent.order?.token?.tokenid] !== undefined
                : true
          ),
        quantity: yup
          .number()
          .min(1, 'quantity must be greater than 0')
          .required('quantity is required')
          .test(
            'order-amount',
            "can't exceed order amount",
            (value, context) =>
              value <= parseBigNumObject(context.parent.order?.bnAmount).toNumber()
          )
          .required('quantity is required'),
        price: yup
          .number()
          .min(0.00000001, 'price must be greater than 1 satoshi')
          .required('price is required')
          .test(
            'needs-funds',
            `not enough ${TICKER}`,
            (value, context) => value <= (balance - FEE) / context.parent.quantity
          ),
      }),
    [balance]
  );

  return schema;
};

export default useFulfillOrderSchema;
