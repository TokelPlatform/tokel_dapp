import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';

import { selectMyOrders, selectTokenDetails } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';

import { Box, SubTitle, Title } from 'components/_General/_UIElements/common';
import { Column, Columns } from 'components/_General/Grid';
import ActiveOrderWidget from 'components/Marketplace/common/ActiveOrderWidget';

const MyOrdersWidget: React.FC = () => {
  const myOrders = useSelector(selectMyOrders);
  const tokenDetails = useSelector(selectTokenDetails);

  const myAsks = useMemo(() => myOrders?.filter(order => order.funcid === 's'), [myOrders]);
  const myBids = useMemo(() => myOrders?.filter(order => order.funcid === 'b'), [myOrders]);

  useEffect(() => {
    myOrders.forEach(order => {
      if (!tokenDetails[order.tokenid])
        sendToBitgo(BitgoAction.TOKEN_V2_INFO_TOKEL, { tokenId: order.tokenid });
    });
  }, [myOrders, tokenDetails]);

  useEffect(() => {
    sendToBitgo(BitgoAction.ASSET_V2_MY_ORDERS);
  }, []);

  return (
    <Column
      size={12}
      css={css`
        padding: 20px 0px 0px;
      `}
    >
      <Columns
        css={css`
          height: 100%;
          padding: 0 !important;
        `}
      >
        <Column size={6}>
          <Box>
            <Title>My sell orders</Title>
            {myAsks?.length === 0 ? (
              <SubTitle>No open orders found</SubTitle>
            ) : (
              <div
                css={css`
                  overflow: auto;
                  padding-top: 12px;
                  max-height: 90%;
                `}
              >
                {myAsks.map(ask => (
                  <ActiveOrderWidget order={ask} key={ask.txid} />
                ))}
              </div>
            )}
          </Box>
        </Column>
        <Column size={6}>
          <Box>
            <Title>My bid orders</Title>
            {myBids?.length === 0 ? (
              <SubTitle>No open orders found</SubTitle>
            ) : (
              <div
                css={css`
                  overflow: auto;
                  padding-top: 12px;
                  max-height: 90%;
                `}
              >
                {myBids.map(bid => (
                  <ActiveOrderWidget order={bid} key={bid.txid} />
                ))}
              </div>
            )}
          </Box>
        </Column>
      </Columns>
    </Column>
  );
};

export default MyOrdersWidget;
