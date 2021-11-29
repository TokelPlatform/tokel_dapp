import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import { selectModalOptions } from 'store/selectors';
import { dispatch } from 'store/rematch';
import { toBitcoin, toSatoshi } from 'satoshi-bitcoin';

import { Columns, Column } from 'components/_General/Grid';
import TokenMediaDisplay from 'components/_General/TokenMediaDisplay';
import Checkbox from 'components/_General/_FormikElements/Checkbox';
import { Button } from 'components/_General/buttons';

import { TokenForm } from 'util/token-types';
import useTokenCreationSchema from 'util/validators/useTokenCreationSchema';
import { Responsive } from 'util/helpers';
import formatTokenFormIntoStandard from 'util/formatTokenFormIntoStandard';
import { V } from 'util/theming';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { FEE, ModalName, TICKER } from 'vars/defines';
import TokenType from 'util/types/TokenType';

const MediaPreviewContainer = styled.div`
  text-align: center;
  max-height: 480px;
  overflow-y: scroll;

  h1 {
    margin-bottom: 0;
  }

  p {
    color: ${V.color.frontSoft};
    font-size: ${V.font.h3};
    margin-top: 0;
  }
`;

const InformationLabel = styled(Column)`
  font-size: ${V.font.h3};
  overflow-wrap: anywhere;
`;
const InformationValue = styled(Column)`
  font-size: ${V.font.h3};
  color: ${V.color.frontSoft};
  overflow-wrap: anywhere;
`;

const InformationRow = styled(Columns)`
  margin-bottom: 2px !important;
`;

const Bottom = styled.div`
  margin-top: auto;
  padding-top: 5px;
  ${Button} {
    margin-top: 12px;
  }
`;

const CustomAttributesDivider = styled.div`
  margin-top: 10px;
  margin-bottom: 25px;
  border-bottom: 1px dashed ${V.color.frontSoft};
  width: 70%;
  margin-left: auto;
  margin-right: auto;
`;

const NotApplicable = () => <i>N/A</i>;

const ConfirmTokenCreationModal: React.FC = () => {
  const token = useSelector(selectModalOptions) as TokenForm;

  const tokenCreationSchema = useTokenCreationSchema();

  const tokenType = useMemo(() => (token.supply === 1 ? TokenType.NFT : TokenType.TOKEN), [token]);
  const tokenTypeName = useMemo(() => (tokenType === TokenType.NFT ? 'NFT' : 'token'), [tokenType]);
  const tokenTypeNameCapitalized = useMemo(
    () => (tokenType === TokenType.NFT ? 'NFT' : 'Token'),
    [tokenType]
  );

  const formikBag = useFormik<TokenForm>({
    validationSchema: tokenCreationSchema,
    initialValues: { ...token, confirmation: false },
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: values => {
      sendToBitgo(BitgoAction.TOKEN_V2_CREATE_TOKEL, formatTokenFormIntoStandard(values));
      dispatch.environment.SET_MODAL({
        name: ModalName.TOKEN_CREATED,
        options: {
          tokenType,
          tokenTypeName,
          tokenTypeNameCapitalized,
        },
      });
    },
  });

  const { submitForm, isSubmitting, isValid } = formikBag;

  const cost = useMemo(() => toBitcoin(String(toSatoshi(FEE) + Number(token.supply))), [token]);

  const collectionAttributes = useMemo(
    () =>
      tokenType === TokenType.NFT
        ? [
            {
              label: 'Collection',
              value: token?.arbitraryAsJson?.collection_name || <NotApplicable />,
            },
            {
              label: 'Number in Collection',
              value: token?.arbitraryAsJson?.number_in_collection || <NotApplicable />,
            },
          ]
        : [],
    [token, tokenType]
  );

  const tokenDisplayAttributes = useMemo(
    () => [
      { label: 'Supply', value: token?.supply },
      {
        label: 'URL',
        value: token?.url || <NotApplicable />,
      },
      {
        label: 'Royalty',
        value: token?.royalty ? `${token?.royalty}% on DEX sales` : <NotApplicable />,
      },
      {
        label: tokenType === TokenType.NFT ? 'Collection ID' : 'ID',
        value: token?.id || <NotApplicable />,
      },
      ...collectionAttributes,
    ],
    [token, tokenType, collectionAttributes]
  );

  const tokenCustomAttributes = useMemo(
    () => token?.arbitraryAsJsonUnformatted?.map(({ key, value }) => ({ label: key, value })),
    [token]
  );

  if (!token) return null;

  return (
    <FormikProvider value={formikBag}>
      <Form>
        <Columns
          css={css`
            align-items: stretch;
          `}
        >
          <Column
            size={5}
            css={css`
              ${Responsive.above.L} {
                padding-right: 35px;
              }
            `}
          >
            <MediaPreviewContainer>
              <TokenMediaDisplay url={token.url} />
              <h1>{token.name}</h1>
              <p>{token.description}</p>
            </MediaPreviewContainer>
          </Column>
          <Column
            size={7}
            css={css`
              ${Responsive.above.L} {
                border-left: 1px solid var(--color-modal-border);
                padding-left: 35px;
              }
              display: flex;
              flex-direction: column;
            `}
          >
            <div
              css={css`
                max-height: 42vh;
                overflow-y: auto;
              `}
            >
              {tokenDisplayAttributes.map(({ label, value }) => (
                <InformationRow key={label}>
                  <InformationLabel size={5}>{label}</InformationLabel>
                  <InformationValue>{value}</InformationValue>
                </InformationRow>
              ))}
              {!!tokenCustomAttributes?.length && <CustomAttributesDivider />}
              {tokenCustomAttributes.map(({ label, value }) => (
                <InformationRow key={label}>
                  <InformationLabel size={5}>{label}</InformationLabel>
                  <InformationValue>{value}</InformationValue>
                </InformationRow>
              ))}
            </div>

            <Bottom>
              <Checkbox
                name="confirmation"
                label={`I understand creating this ${tokenTypeName} will cost ${cost} ${TICKER}`}
              />
              <Button
                type="button"
                onClick={submitForm}
                theme="purple"
                disabled={isSubmitting || !isValid}
                data-tid="create-token"
              >
                Create my {tokenTypeName}
              </Button>
            </Bottom>
          </Column>
        </Columns>
      </Form>
    </FormikProvider>
  );
};

export default ConfirmTokenCreationModal;
