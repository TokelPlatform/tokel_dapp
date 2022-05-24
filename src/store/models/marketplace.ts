import { createModel } from '@rematch/core';
import dp from 'dot-prop-immutable';

import { OrderDetail, OrderDetailLite } from 'util/token-types';

import type { RootModel } from './models';

export type MarketplaceState = {
  orderDetails: Record<string, OrderDetail>;
  myOrders: Array<OrderDetailLite>;
  offers: Record<string, Array<OrderDetailLite>>;
};

export default createModel<RootModel>()({
  state: {
    orderDetails: {},
    myOrders: [],
    offers: {},
  } as MarketplaceState,
  reducers: {
    SET_ORDER_DETAIL: (state, order: OrderDetail) => {
      return dp.set(state, `orderDetails.${order.orderid}`, order);
    },
    SET_MY_ORDERS: (state, orders: OrderDetailLite[]) => ({ ...state, myOrders: orders }),
    SET_OFFERS: (state, offers: OrderDetailLite[]) => {
      let newState = state;
      offers.forEach((offer, index) => {
        newState =
          offer.funcid === 'b'
            ? dp.set(newState, `offers.${offer.tokenid}[${index}]`, offer)
            : newState;
      });
      return newState;
    },
  },
  effects: () => ({}),
});
