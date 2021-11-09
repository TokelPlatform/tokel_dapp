import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';

import { Form, Formik } from 'formik';
import Field from 'components/_General/_FormikElements/Field';
import Checkbox from 'components/_General/_FormikElements/Checkbox';
import Select from 'components/_General/_FormikElements/Select';

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
              <Field
                name="name"
                type="text"
                label={`${tokenTypeDisplay} Name`}
                placeholder={`My${tokenTypeDisplay}`}
              />

              <Field
                name="description"
                type="textarea"
                label="Description"
                placeholder={`What does your ${tokenTypeDisplay} represent?`}
              />

              <Field
                name="supply"
                type="number"
                label="Supply"
                disabled={tokenType === TokenType.NFT}
                placeholder="100,000"
                min={1}
                max={200000}
              />

              <Field
                name="url"
                type="text"
                label="Media URL (optional)"
                placeholder={`Media URL representing your ${tokenTypeDisplay}`}
              />

              <Field
                name="royalty"
                type="number"
                min={1}
                max={100}
                label="Royalty (optional)"
                placeholder="0"
              />

              <CaretContainer open={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)}>
                Advanced <img src={Caret} alt="caret" />
              </CaretContainer>

              {showAdvanced && (
                <Field
                  name="id"
                  type="text"
                  label="Identifier (ID, optional)"
                  placeholder="Numeric ID, UUID, or string ID"
                />
              )}
            </Column>
            <Column size={7} style={{ overflow: 'scroll' }}>
              <Select
                name="dataAsJson[constellation_name]"
                label="Constellation (optional)"
                placeholder="Type to select a constellation or create a new one..."
                options={[
                  { label: 'Constellation 1', value: 'constellation_1' },
                  { label: 'Constellation 2', value: 'constellation_2' },
                ]}
                creatable
              />

              <Field
                name="dataAsJson[number_in_constellation]"
                type="number"
                label="Number in Constellation (optional)"
                min={1}
                placeholder="N/A"
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
