import React from 'react';

import styled from '@emotion/styled';

import links from 'util/links';

import BackButton from 'components/_General/BackButton';
import { Button } from 'components/_General/buttons';
import Warning from '../_General/WarningCritical';
import CredentialsRow from './CredentialsRow';

type GeneratedCredentialProps = {
  goBack: () => void;
  forward: () => void;
  wifkey: string;
  seed: string;
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 23% 50% 20%;
  justify-items: center;
  align-items: end;
`;

const BtnWrapper = styled.div`
  position: absolute;
  left: 7.75rem;
  top: 5.5rem;
  cursor: pointer;
`;

const Confidential = styled.div`
  margin: 1rem 0;
  padding: 0.5rem 1.5em;
  height: 150px;
  width: 500px;
  background: rgba(248, 7, 89, 0.05);
  border: 1px solid var(--color-danger);
  border-radius: var(--border-radius);
`;

const GeneratedCredential = ({ wifkey, seed, forward, goBack }: GeneratedCredentialProps) => {
  return (
    <Container>
      <BtnWrapper>
        <BackButton onClick={goBack} />
      </BtnWrapper>
      <h1>Your WIF and your Seed Phrase</h1>
      <Confidential>
        <CredentialsRow
          label="Your Key"
          sublabel="- private key and is used to login to your wallet"
          credential={wifkey}
        />
        <CredentialsRow
          label="Seed Phrase"
          sublabel="- can be used as a backup login option"
          credential={seed}
        />
      </Confidential>
      <Warning
        title="Important: please back up your seed phrase and WIF now!"
        subtitle={[
          ' We recommend storing it offline. ',
          <a href={links.security} key="securitylink" rel="noreferrer" target="_blank">
            Learn security best practices
          </a>,
        ]}
      />

      <Button onClick={forward} customWidth="170px" theme="gray">
        Next
      </Button>
    </Container>
  );
};

export default GeneratedCredential;
