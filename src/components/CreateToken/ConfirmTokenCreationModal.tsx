import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { selectModalOptions } from 'store/selectors';
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

  const tokenTypeName = useMemo(() => (token.supply === 1 ? 'NFT' : 'token'), [token]);
  const cost = useMemo(() => toBitcoin(String(toSatoshi(FEE) + Number(token.supply))), [token]);

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
    <Formik
      validationSchema={tokenCreationSchema}
      initialValues={{ ...token, confirmation: false }}
      validateOnMount
      enableReinitialize
      onSubmit={(values, { setSubmitting, setStatus }) => {
        setSubmitting(false);
        setStatus({
          success: true,
          button: `${capitalize(tokenTypeName)} created!`,
          message:
            'A transaction has been broadcasted creating your token. Please check your wallet in a few minutes.',
        });
        try {
          sendToBitgo(BitgoAction.TOKEN_V2_CREATE_TOKEL, formatTokenFormIntoStandard(values));
          // throw Error('Not implemented');
        } catch (e) {
          console.error(e);
          setStatus({
            success: false,
            button: `Failed to create ${tokenTypeName}`,
            message: `An error has ocurred while broadcasting your ${tokenTypeName}. Please confirm that no transaction has been broacast and try again in a few minutes.`,
          });
        }
      }}
    >
      {({ submitForm, isSubmitting, isValid, status }) => (
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
      )}
    </Formik>
  );
};

export default ConfirmTokenCreationModal;
