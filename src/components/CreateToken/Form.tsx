import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { Form, FormikProvider, useFormik } from 'formik';

import Caret from 'assets/Caret.svg';
import useMyCollections from 'hooks/useMyCollections';
import usePrevious from 'hooks/usePrevious';
import { dispatch } from 'store/rematch';
import { V } from 'util/theming';
import { TokenForm } from 'util/token-types';
import TokenType from 'util/types/TokenType';
import useTokenCreationSchema from 'util/validators/useTokenCreationSchema';
import { HIDE_IPFS_EXPLAINER_KEY, ModalName } from 'vars/defines';

import Checkbox from 'components/_General/_FormikElements/Checkbox';
import Field from 'components/_General/_FormikElements/Field';
import MultiKeyValue from 'components/_General/_FormikElements/MultiKeyValue';
import Select, { SelectOption } from 'components/_General/_FormikElements/Select';
import { Button } from 'components/_General/buttons';
import { Column, Columns } from 'components/_General/Grid';

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

const initialValues: Partial<TokenForm> = {
  name: '',
  description: '',
  url: '',
  royalty: 0,
  supply: '',
  id: null,
  confirmation: false,
  arbitraryAsJson: {
    collection_name: '',
    number_in_collection: '',
  },
  arbitraryAsJsonUnformatted: [],
};

const CreateTokenForm: React.FC<CreateTokenFormProps> = ({ tokenType }) => {
  const tokenTypeDisplay = tokenType === TokenType.NFT ? 'NFT' : 'Token';
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [shownIpfsNotice, setShownIpfsNotice] = useState(false);
  const tokenCreationSchema = useTokenCreationSchema();

  const formikBag = useFormik<Partial<TokenForm>>({
    validationSchema: tokenCreationSchema,
    initialValues,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false);
      dispatch.environment.SET_MODAL({
        name: ModalName.CONFIRM_TOKEN_CREATION,
        options: { ...values, confirmation: false },
      });
    },
  });

  const { setValues, values, submitForm, isSubmitting, isValid, setFieldValue } = formikBag;

  const previousTokenType = usePrevious(tokenType);
  const previousValues = usePrevious(values);
  const myCollections = useMyCollections();

  const handleMediaFieldFocus = () => {
    if (localStorage.getItem(HIDE_IPFS_EXPLAINER_KEY) || shownIpfsNotice) return;

    dispatch.environment.SET_MODAL({
      name: ModalName.IPFS_EXPLAINER,
    });

    setShownIpfsNotice(true);
  };

  useEffect(() => {
    setShownIpfsNotice(false);
  }, [tokenType]);

  useEffect(() => {
    // Persist only name, description, url and royalty if changing between fungible and NFT
    if (previousTokenType !== tokenType)
      setValues(
        {
          ...initialValues,
          name: values.name,
          description: values.description,
          url: values.url,
          royalty: values.royalty,
          supply: tokenType === TokenType.NFT ? 1 : '',
        },
        true
      );
  }, [tokenType, previousTokenType, setValues, values]);

  // If collection changes, format received ReactSelect option and set ID
  useEffect(() => {
    const collectionOption = values.arbitraryAsJson?.collection_name as SelectOption;
    if (typeof collectionOption === 'object') {
      /* eslint no-underscore-dangle: 0 */
      if (collectionOption.__isNew__) {
        setFieldValue('id', Math.floor(Math.random() * 999999));
      } else {
        setFieldValue('id', collectionOption?.value);
      }

      setFieldValue('arbitraryAsJson[collection_name]', collectionOption?.label);
    } else if (collectionOption === undefined) {
      setFieldValue('id', '');
    }
  }, [values.arbitraryAsJson.collection_name, setFieldValue]);

  // If ID changes manually, set collection
  useEffect(() => {
    if (
      values?.id !== previousValues?.id &&
      values?.arbitraryAsJson?.collection_name === previousValues?.arbitraryAsJson?.collection_name
    ) {
      setFieldValue('arbitraryAsJson[collection_name]', myCollections[values.id]?.label || '');
    }
  }, [myCollections, values, previousValues, setFieldValue]);

  const formattedSelectedCollectionOption = typeof values.arbitraryAsJson.collection_name ===
    'string' &&
    Boolean(values.arbitraryAsJson.collection_name?.length) && {
      label: values.arbitraryAsJson.collection_name as string,
      value: values.id,
    };

  return (
    <FormikProvider value={formikBag}>
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
              help={`A description to go with your ${tokenTypeDisplay}. Can have a max length of 4096 characters.`}
            />

            <Field
              name="supply"
              type="number"
              label="Supply"
              readOnly={tokenType === TokenType.NFT}
              placeholder="100,000"
              min={1}
              help="How many of your tokens will exist? For NFTs, this field is always 1. The cost to create your token is roughly the value of this field times 0.00000001 TKL, plus transaction fees."
            />

            <Field
              name="url"
              type="text"
              label="Media URL (optional)"
              placeholder={`Image, video, or audio URL representing your ${tokenTypeDisplay}`}
              help={`An image, video or audio file representing this ${tokenTypeDisplay}. We recommend using IPFS or other permantent file storage solution so your ${tokenTypeDisplay} doesn't get lost in time!`}
              onFocus={handleMediaFieldFocus}
            />

            <Field
              name="royalty"
              type="number"
              label="Royalty (optional)"
              placeholder="0"
              help={`Anytime this ${tokenTypeDisplay} is sold through the Tokel DEX, you can make a comission, even if you're not participating in the sale. Can range from 1% to 99.9%`}
              append="%"
            />

            <CaretContainer open={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)}>
              Advanced <img src={Caret} alt="caret" />
            </CaretContainer>

            {showAdvanced && (
              <Field
                name="id"
                type="number"
                label="Identifier (ID, optional)"
                placeholder="Numeric ID"
                help={`This is the ID of the Collection this ${tokenTypeDisplay} belongs to. You can define this manually, but it will override the Collection field. If you select a Collection, this field gets set automatically.`}
              />
            )}
          </Column>
          <Column size={7}>
            {tokenType === TokenType.NFT && (
              <>
                <Select
                  name="arbitraryAsJson[collection_name]"
                  label="Collection (optional)"
                  placeholder="Type to select a collection or create a new one..."
                  help="Collection is the term used for an NFT collection on the Tokel Platform. A group of NFTs is called a Collection."
                  options={Object.values(myCollections)}
                  formattedSelectedOption={formattedSelectedCollectionOption}
                  creatable
                />
                <Field
                  name="arbitraryAsJson[number_in_collection]"
                  type="number"
                  label="Number in Collection (optional)"
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
    </FormikProvider>
  );
};

export default CreateTokenForm;
