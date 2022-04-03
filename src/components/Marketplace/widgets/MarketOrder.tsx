import React from 'react';

import { css } from '@emotion/react';
import { Form, FormikProvider, useFormik } from 'formik';

import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { TICKER } from 'vars/defines';

import Field from 'components/_General/_FormikElements/Field';
import Select, { SelectOption } from 'components/_General/_FormikElements/Select';
import { Box, CenteredButtonWrapper } from 'components/_General/_UIElements/common';
import { Button } from 'components/_General/buttons';
import { Column, Columns } from 'components/_General/Grid';
import AssetPlaceholder from '../common/AssetPlaceholder';

const initialValues = {};

interface MarketOrderWidgetProps {
  type: 'ask' | 'bid' | 'fill';
}

type MarketOrder = {
  asset_id?: string;
  order_id?: string;
  quantity: number;
  price: number;
};

const MarketOrderWidget: React.FC<MarketOrderWidgetProps> = ({ type }) => {
  const handleMarketOrder = (values, { setSubmitting }) => {
    setSubmitting(false);
    // dispatch.environment.SET_MODAL({
    //   name: ModalName.CONFIRM_TOKEN_CREATION,
    //   options: { ...values, confirmation: false },
    // });
    sendToBitgo(BitgoAction.ASSET_V2_DECODE_ORDER, {
      spk: {
        asm: '4da240a00fa003800103af038001f5af038001f6a12da22b8020372291b16b9c8bab27def01f3d96e96f97f5ab14b1cab090dbe9296b70fd87bb810302040082020204 OP_CHECKCRYPTOCONDITION 0402f60101210345d2e7ab018619da6ed58ccc0138c5f58a7b754bd8e9a1a9d2b811c5fe72d467 OP_DROP',
        hex: '434da240a00fa003800103af038001f5af038001f6a12da22b8020372291b16b9c8bab27def01f3d96e96f97f5ab14b1cab090dbe9296b70fd87bb810302040082020204cc270402f60101210345d2e7ab018619da6ed58ccc0138c5f58a7b754bd8e9a1a9d2b811c5fe72d46775',
        reqSigs: 1,
        type: 'cryptocondition',
        addresses: ['CTYmzXTPdztg6NWy5vRu7jcnBVU3fRXrtk'],
      },
    });
  };

  const formikBag = useFormik<Partial<MarketOrder>>({
    // validationSchema: tokenCreationSchema,
    initialValues,
    onSubmit: handleMarketOrder,
  });

  const buttonLabel =
    type === 'ask' ? 'Review sell order' : type === 'bid' ? 'Review bid order' : 'Review order';

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
              name="order_id"
              placeholder="Paste an ask or bid ID to fill"
              label="Order ID"
              help="If someone has sent you an order ID, you may paste it here to see further information and fulfill it"
            />
          )}

          {type === 'ask' && (
            <Select
              name="asset_id"
              label="Asset to sell"
              placeholder="Search for an asset you own..."
              options={[]}
              help="Select an asset you own and place an order to sell it. You'll receive an order ID you can send to the buyer to complete the order."
              // formattedSelectedOption={formattedSelectedCollectionOption}
            />
          )}

          {type === 'bid' && (
            <Field
              name="asset_id"
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

          <AssetPlaceholder />
          <CenteredButtonWrapper
            css={css`
              margin-top: 15px;
            `}
          >
            <Button theme="purple">{buttonLabel}</Button>
          </CenteredButtonWrapper>
        </Form>
      </FormikProvider>
    </Box>
  );
};

export default MarketOrderWidget;
