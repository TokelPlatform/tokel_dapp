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
import { V } from 'util/theming';

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
  background-color: ${V.color.back};
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
      validationSchema={tokenCreationSchema}
      initialValues={initialValues}
      isInitialValid={false}
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
                help={`The name of your ${tokenTypeDisplay}! Think of something cool. This will be shown in the wallet and explorer.`}
              />

              <Field
                name="description"
                type="textarea"
                label="Description"
                placeholder={`What does your ${tokenTypeDisplay} represent?`}
                help={`A description to go with your ${tokenTypeDisplay}. Can have a max lenght of 4096 characters.`}
              />

              <Field
                name="supply"
                type="number"
                label="Supply"
                readOnly={tokenType === TokenType.NFT}
                placeholder="100,000"
                min={1}
                max={200000000}
                help="How many of your tokens will exist? For NFTs, this field is always 1. For fungible tokens, this can range until 200 million"
              />

              <Field
                name="url"
                type="text"
                label="Media URL (optional)"
                placeholder={`Media URL representing your ${tokenTypeDisplay}`}
                help={`The media representing this ${tokenTypeDisplay}. We recommend using IPFS or other permantent file storage solution so your ${tokenTypeDisplay} doesn't get lost in time!`}
              />

              <Field
                name="royalty"
                type="number"
                min={0}
                max={100}
                label="Royalty (optional)"
                placeholder="0"
                help={`Anytime this ${tokenTypeDisplay} is sold through the Tokel DEX, you can make a comission, even if you're not participating on the sale. Can range from 1% to 100%`}
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
                  help={`This is the ID of the Constellation this ${tokenTypeDisplay} belongs to. You can define this manually, but it will override the Constellation field. If you select a Constellation, this field gets set automatically.`}
                />
              )}
            </Column>
            <Column size={7}>
              {tokenType === TokenType.NFT && (
                <>
                  <Select
                    name="arbitraryAsJson[constellation_name]"
                    label="Constellation (optional)"
                    placeholder="Type to select a constellation or create a new one..."
                    help="Constellation is the term used for an NFT collection on the Tokel Platform. A group of NFTs is called a Constellation."
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
                    help="If this is part of a series, you can number this item here. Not required."
                  />
                </>
              )}

              <MultiKeyValue
                name="arbitraryAsJsonUnformatted"
                label="Custom Attributes (optional)"
                help={`You can use this field to add any property to your ${tokenTypeDisplay}, in a key-value fashion. Think of attributes like strenght, luck, color, etc.`}
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
