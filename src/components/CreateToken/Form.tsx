import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { dispatch } from 'store/rematch';

import { Form, Formik } from 'formik';
import Field from 'components/_General/_FormikElements/Field';
import Checkbox from 'components/_General/_FormikElements/Checkbox';
import Select from 'components/_General/_FormikElements/Select';
import MultiKeyValue from 'components/_General/_FormikElements/MultiKeyValue';
import { Button } from 'components/_General/buttons';
import { Columns, Column } from 'components/_General/Grid';

import TokenType from 'util/types/TokenType';
import { TokenForm } from 'util/token-types';

import Caret from 'assets/Caret.svg';

import tokenCreationSchema from 'util/validators/tokenCreationSchema';
import { ModalName } from 'vars/defines';

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

const Bottom = styled(Columns)`
  position: sticky;
  background-color: ${props => props.theme.color.back};
  bottom: 0;
  margin-top: auto;

  ${Column} {
    display: flex;
    width: 100%;
    align-items: center;
  }

  button {
    margin-left: auto;
    margin-right: 5px;
  }
`;

const FormStyled = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

const CreateTokenForm: React.FC<CreateTokenFormProps> = ({ tokenType }) => {
  const tokenTypeDisplay = tokenType === TokenType.NFT ? 'NFT' : 'Token';
  const [showAdvanced, setShowAdvanced] = useState(false);

  const initialValues: Partial<TokenForm> = useMemo(
    () => ({
      name: '',
      description: '',
      supply: tokenType === TokenType.NFT ? 1 : '',
      url: '',
      royalty: undefined,
      id: '',
      confirmation: false,
      arbitraryAsJson: {
        constellation_name: '',
        number_in_constellation: '',
      },
      arbitraryAsJsonUnformatted: [],
    }),
    [tokenType]
  );

  return (
    <Formik
      // validationSchema={tokenCreationSchema}
      initialValues={initialValues}
      // isInitialValid={false}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        console.log('here we go');
        setSubmitting(false);
        dispatch.environment.SET_MODAL({
          name: ModalName.CONFIRM_TOKEN_CREATION,
          options: values,
        });
      }}
    >
      {({ submitForm, isSubmitting, isValid }) => (
        <FormStyled>
          <Columns>
            <Column size={5}>
              <Field
                name="name"
                type="text"
                label={`${tokenTypeDisplay} Name`}
                placeholder={`My${tokenTypeDisplay}`}
                help="Lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
              />

              <Field
                name="description"
                type="textarea"
                label="Description"
                placeholder={`What does your ${tokenTypeDisplay} represent?`}
                help="Lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
              />

              <Field
                name="supply"
                type="number"
                label="Supply"
                readOnly={tokenType === TokenType.NFT}
                placeholder="100,000"
                min={1}
                max={200000000}
                help="Lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
              />

              <Field
                name="url"
                type="text"
                label="Media URL (optional)"
                placeholder={`Media URL representing your ${tokenTypeDisplay}`}
                help="Lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
              />

              <Field
                name="royalty"
                type="number"
                min={0}
                max={100}
                label="Royalty (optional)"
                placeholder="0"
                help="Lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
                append="%"
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
                  help="Lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
                />
              )}
            </Column>
            <Column size={7}>
              <Select
                name="arbitraryAsJson[constellation_name]"
                label="Constellation (optional)"
                placeholder="Type to select a constellation or create a new one..."
                help="Lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
                options={[
                  { label: 'Constellation 1', value: 'constellation_1' },
                  { label: 'Constellation 2', value: 'constellation_2' },
                ]}
                creatable
              />

              <Field
                name="arbitraryAsJson[number_in_constellation]"
                type="number"
                label="Number in Constellation (optional)"
                min={1}
                placeholder="N/A"
                help="Lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
              />

              <MultiKeyValue
                name="arbitraryAsJsonUnformatted"
                label="Custom Attributes (optional)"
                help="Lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
              />
            </Column>
          </Columns>

          <Bottom>
            <Column size={12}>
              <Checkbox
                name="confirmation"
                label="I have checked and double checked all the inputs"
              />
              <Button
                onClick={submitForm}
                theme="purple"
                disabled={isSubmitting || !isValid}
                data-tid="submit-token"
              >
                Continue
              </Button>
            </Column>
          </Bottom>
        </FormStyled>
      )}
    </Formik>
  );
};

CreateTokenForm.defaultProps = {};

export default CreateTokenForm;
