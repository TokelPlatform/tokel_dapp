import React, { useMemo, useEffect } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import {
  selectModalOptions,
  selectTokenCreationTxError,
  selectTokenCreationTxId,
  selectTokenCreationTxStatus,
} from 'store/selectors';
import { dispatch } from 'store/rematch';
import { toBitcoin, toSatoshi } from 'satoshi-bitcoin';
import capitalize from 'lodash-es/capitalize';

import { Columns, Column } from 'components/_General/Grid';
import TokenMediaDisplay from 'components/_General/TokenMediaDisplay';
import Checkbox from 'components/_General/_FormikElements/Checkbox';
import { Button } from 'components/_General/buttons';

import { TokenForm } from 'util/token-types';
import tokenCreationSchema from 'util/validators/tokenCreationSchema';
import { Responsive } from 'util/helpers';
import formatTokenFormIntoStandard from 'util/formatTokenFormIntoStandard';
import { V } from 'util/theming';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { FEE, TICKER } from 'vars/defines';

const MediaPreviewContainer = styled.div`
  text-align: center;

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
  padding-top: 70px;
  ${Button} {
    margin-top: 12px;
  }
`;

const NotApplicable = () => <i>N/A</i>;

const ConfirmTokenCreationModal: React.FC = () => {
  const token = useSelector(selectModalOptions) as TokenForm;

  const error = useSelector(selectTokenCreationTxError);
  const txStatus = useSelector(selectTokenCreationTxStatus);
  const txId = useSelector(selectTokenCreationTxId);

  const formikBag = useFormik<TokenForm>({
    validationSchema: tokenCreationSchema,
    initialValues: { ...token, confirmation: false },
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: values => {
      sendToBitgo(BitgoAction.TOKEN_V2_CREATE_TOKEL, formatTokenFormIntoStandard(values));
    },
  });

  const { submitForm, isSubmitting, isValid, status, setStatus, setSubmitting } = formikBag;
  const tokenTypeName = useMemo(() => (token.supply === 1 ? 'NFT' : 'token'), [token]);
  const cost = useMemo(() => toBitcoin(String(toSatoshi(FEE) + Number(token.supply))), [token]);

  useEffect(() => {
    if (txStatus !== 0) {
      const success = txStatus > 0;
      setSubmitting(false);
      setStatus({
        success,
        button: success
          ? `${capitalize(tokenTypeName)} created!`
          : `Failed to create ${tokenTypeName}`,
        message: success
          ? `A transaction has been broadcasted creating your token: TxId: ${txId}. Please check your wallet in a few minutes.`
          : `An error has ocurred while broadcasting your ${tokenTypeName}: ${error}. Please confirm that no transaction has been broacast and try again in a few minutes.`,
      });
    }
  }, [error, txStatus, setSubmitting, setStatus, txId, tokenTypeName, isSubmitting]);

  useEffect(() => {
    return () => {
      dispatch.tokenCreation.RESET_TX();
    };
  }, []);

  const tokenDisplayAttributes = useMemo(
    () => [
      { label: 'Supply', value: token?.supply },
      {
        label: 'Collection',
        value: token?.arbitraryAsJson?.constellation_name || <NotApplicable />,
      },
      {
        label: 'Collection ID',
        value: token?.id || <NotApplicable />,
      },
      {
        label: 'Number in Collection',
        value: token?.arbitraryAsJson?.number_in_constellation || <NotApplicable />,
      },
      {
        label: 'URL',
        value: token?.url || <NotApplicable />,
      },
      ...token?.arbitraryAsJsonUnformatted?.map(({ key, value }) => ({ label: key, value })),
      {
        label: 'Royalty',
        value: token?.royalty ? `${token?.royalty}% on DEX sales` : <NotApplicable />,
      },
    ],
    [token]
  );

  if (!token) return null;

  return (
    <FormikProvider value={formikBag}>
      <Form>
        <Columns vcentered>
          <Column size={5} css={css(`${Responsive.above.L} { padding-right: 35px; }`)}>
            <MediaPreviewContainer>
              <TokenMediaDisplay url={token.url} />
              <h1>{token.name}</h1>
              <p>{token.description}</p>
            </MediaPreviewContainer>
          </Column>
          <Column
            css={css(
              `${Responsive.above.L} { border-left: 1px solid var(--color-modal-border); padding-left: 35px; }`
            )}
          >
            <div css={css(`max-height: 320px; overflow-y: auto;`)}>
              {tokenDisplayAttributes.map(({ label, value }) => (
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
                onClick={status ? () => {} : submitForm}
                theme={!status ? 'purple' : status.success ? 'success' : 'danger'}
                disabled={isSubmitting || !isValid}
                data-tid="create-token"
              >
                {!status ? `Create my ${tokenTypeName}` : status.button}
              </Button>

              {!!status && <p>{status.message}</p>}
            </Bottom>
          </Column>
        </Columns>
      </Form>
    </FormikProvider>
  );
};

export default ConfirmTokenCreationModal;
