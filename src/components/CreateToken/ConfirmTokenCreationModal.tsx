import React from 'react';
import { useSelector } from 'react-redux';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Form, FormikProvider, useFormik } from 'formik';
import { toBitcoin, toSatoshi } from 'satoshi-bitcoin';

import { dispatch } from 'store/rematch';
import { selectModalOptions } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import formatTokenFormIntoStandard from 'util/formatTokenFormIntoStandard';
import { Responsive } from 'util/helpers';
import { V } from 'util/theming';
import { TokenForm } from 'util/token-types';
import TokenType from 'util/types/TokenType';
import useTokenCreationSchema from 'util/validators/useTokenCreationSchema';
import { FEE, ModalName, TICKER, TOKEN_MARKER_FEE } from 'vars/defines';

import Checkbox from 'components/_General/_FormikElements/Checkbox';
import { Button } from 'components/_General/buttons';
import { Column, Columns } from 'components/_General/Grid';
import TokenMediaDisplay from 'components/_General/TokenMediaDisplay';

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
  const token = useSelector(selectModalOptions) as unknown as TokenForm;

  const tokenCreationSchema = useTokenCreationSchema();

  const tokenHelpers = React.useMemo(() => {
    const tokenType = token.supply === 1 ? TokenType.NFT : TokenType.TOKEN;
    const tokenTypeName = tokenType === TokenType.NFT ? 'NFT' : 'token';
    const tokenTypeNameCapitalized = tokenType === TokenType.NFT ? 'NFT' : 'Token';

    const cost = toBitcoin(String(toSatoshi(FEE + TOKEN_MARKER_FEE) + Number(token.supply)));

    const collectionAttributes =
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
        : [];

    const tokenDisplayAttributes = [
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
    ];

    const tokenCustomAttributes = token?.arbitraryAsJsonUnformatted?.map(({ key, value }) => ({
      label: key,
      value,
    }));

    return {
      tokenType,
      tokenTypeName,
      tokenTypeNameCapitalized,
      cost,
      collectionAttributes,
      tokenDisplayAttributes,
      tokenCustomAttributes,
    };
  }, [token]);

  const {
    tokenType,
    tokenTypeName,
    tokenTypeNameCapitalized,
    cost,
    tokenDisplayAttributes,
    tokenCustomAttributes,
  } = tokenHelpers;

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
              {Boolean(tokenCustomAttributes?.length) && <CustomAttributesDivider />}
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
