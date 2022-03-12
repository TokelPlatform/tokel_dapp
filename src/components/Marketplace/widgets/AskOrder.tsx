import React from 'react';

import { css } from '@emotion/react';
import { Form, Formik } from 'formik';

import { TICKER } from 'vars/defines';

import Field from 'components/_General/_FormikElements/Field';
import Select, { SelectOption } from 'components/_General/_FormikElements/Select';
import { Box, CenteredButtonWrapper } from 'components/_General/_UIElements/common';
import { Button } from 'components/_General/buttons';
import { Column, Columns } from 'components/_General/Grid';
import AssetPlaceholder from '../common/AssetPlaceholder';

const initialValues = {
  assetId: '',
  quantity: 0,
  price: 0,
};

interface AskOrderWidgetProps {}

const AskOrderWidget: React.FC<AskOrderWidgetProps> = () => {
  return (
    <Box css={css(`height: 50%; margin-bottom: 15px;`)}>
      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          console.log('submited');
        }}
      >
        <Form>
          <h2
            css={css`
              margin: 0;
            `}
          >
            Create sell order
          </h2>
          <Select
            name="assetId"
            label="Asset to sell"
            placeholder="Search for an asset you own..."
            options={[]}
            // formattedSelectedOption={formattedSelectedCollectionOption}
          />
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
            <Button theme="purple" disabled>
              Post ask
            </Button>
          </CenteredButtonWrapper>
        </Form>
      </Formik>
    </Box>
  );
};

export default AskOrderWidget;
