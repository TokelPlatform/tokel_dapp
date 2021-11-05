import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';

import { Form, Formik } from 'formik';
import { FieldWithLabel } from 'components/_General/_FormikElements/FieldWithLabel';
import Checkbox from 'components/_General/_FormikElements/Checkbox';

import TokenType from 'util/types/TokenType';
import { TokenDetail } from 'util/token-types';

import Caret from 'assets/Caret.svg';

import { Columns, Column } from 'components/_General/Grid';
import { Button } from 'components/_General/buttons';

interface CreateTokenFormProps {
  tokenType: TokenType;
}

const CaretContainer = styled.span<{ open: boolean }>`
  width: max-content;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  img {
    ${({ open }) => (open ? '' : 'transform: rotate(90deg)')};
    margin-left: 6px;
  }
`;

const Bottom = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  button {
    margin-left: auto;
    margin-right: 5px;
  }
`;

const CreateTokenForm: React.FC<CreateTokenFormProps> = ({ tokenType }) => {
  const tokenTypeDisplay = tokenType === TokenType.NFT ? 'NFT' : 'Token';
  const [showAdvanced, setShowAdvanced] = useState(false);

  const initialValues: Partial<TokenDetail> = useMemo(
    () => ({
      supply: tokenType === TokenType.NFT ? 1 : undefined,
    }),
    [tokenType]
  );

  return (
    <Formik
      style={{ height: '100%' }}
      initialValues={initialValues}
      enableReinitialize
      onSubmit={() => {
        console.log('here we go');
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Form style={{ height: '100%' }}>
          <Columns style={{ height: '90%' }}>
            <Column size={5} style={{ overflow: 'scroll' }}>
              <FieldWithLabel
                name="name"
                type="text"
                label={`${tokenTypeDisplay} Name`}
                placeholder={`My${tokenTypeDisplay}`}
              />

              <FieldWithLabel
                name="description"
                type="textarea"
                label="Description"
                placeholder={`What does your ${tokenTypeDisplay} represent?`}
              />

              <FieldWithLabel
                name="supply"
                type="number"
                label="Supply"
                disabled={tokenType === TokenType.NFT}
                placeholder="100,000"
                min={1}
                max={200000}
              />

              <FieldWithLabel
                name="url"
                type="text"
                label="Media URL (optional)"
                placeholder={`Media URL representing your ${tokenTypeDisplay}`}
              />

              <FieldWithLabel
                name="royalty"
                type="number"
                min={1}
                max={100}
                label="Royalty (optional)"
                placeholder="0"
              />

              <CaretContainer open={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)}>
                Advanced <img src={Caret} />
              </CaretContainer>

              {showAdvanced && (
                <FieldWithLabel
                  name="id"
                  type="text"
                  label="Identifier (ID, optional)"
                  placeholder="Numeric ID, UUID, or string ID"
                />
              )}
            </Column>
            <Column size={7} style={{ overflow: 'scroll' }}>
              <FieldWithLabel
                name="dataAsJson[constellation_name]"
                type="text"
                label="Constellation (optional)"
                placeholder="Type to select a constellation or create a new one..."
              />

              <FieldWithLabel
                name="dataAsJson[number_in_constellation]"
                type="number"
                label="Number in Constellation (optional)"
                min={1}
                placeholder="1"
              />
            </Column>
          </Columns>

          <Columns>
            <Column size={12}>
              <Bottom>
                <Checkbox name="consent" label="I have checked and double checked all the inputs" />
                <Button
                  onClick={submitForm}
                  theme="purple"
                  disabled={isSubmitting}
                  data-tid="login-button"
                >
                  Continue
                </Button>
              </Bottom>
            </Column>
          </Columns>
        </Form>
      )}
    </Formik>
  );
};

CreateTokenForm.defaultProps = {};

export default CreateTokenForm;
