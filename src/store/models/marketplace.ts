import { createModel } from '@rematch/core';
import dp from 'dot-prop-immutable';

import { OrderDetail } from 'util/token-types';

import type { RootModel } from './models';

export type MarketplaceState = {
  orderDetails: Record<string, OrderDetail>;
};

export default createModel<RootModel>()({
  state: {} as MarketplaceState,
  reducers: {
    SET_ORDER_DETAIL: (state, order: OrderDetail) => {
      return dp.set(state, `orderDetails.${order.orderid}`, order);
    },
  },
  effects: () => ({}),
});
