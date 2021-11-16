import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { selectModalOptions } from 'store/selectors';

import { Columns, Column } from 'components/_General/Grid';
import TokenMediaDisplay from 'components/_General/TokenMediaDisplay';
import Checkbox from 'components/_General/_FormikElements/Checkbox';
import { Button } from 'components/_General/buttons';

import { TokenForm } from 'util/token-types';
import tokenCreationSchema from 'util/validators/tokenCreationSchema';
import { Responsive } from 'util/helpers';
import { V } from 'util/theming';

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

  return (
    <Formik
      validationSchema={tokenCreationSchema}
      initialValues={{ ...token, confirmation: false }}
      isInitialValid={false}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        console.log('here we go', values);
        setSubmitting(false);
      }}
    >
      {({ submitForm, isSubmitting, isValid }) => (
        <Form>
          <Columns vcentered>
            <Column
              size={5}
              css={css(
                `${Responsive.above.L} { border-right: 1px solid var(--color-modal-border); padding-right: 35px; }`
              )}
            >
              <MediaPreviewContainer>
                <TokenMediaDisplay url={token.url} />
                <h1>{token.name}</h1>
                <p>{token.description}</p>
              </MediaPreviewContainer>
            </Column>
            <Column css={css(`${Responsive.above.L} { padding-left: 35px; }`)}>
              {tokenDisplayAttributes.map(({ label, value }) => (
                <InformationRow key={label}>
                  <InformationLabel size={5}>{label}</InformationLabel>
                  <InformationValue>{value}</InformationValue>
                </InformationRow>
              ))}

              <Bottom>
                <Checkbox
                  name="confirmation"
                  label={`I understand creating this ${tokenTypeName} will cost 1 dust of TKL`}
                />
                <Button
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
      )}
    </Formik>
  );
};

export default ConfirmTokenCreationModal;
