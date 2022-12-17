import React from 'react';

import styled from '@emotion/styled';

import links from 'util/links';

import { Button } from 'components/_General/buttons';
import Warning from 'components/_General/WarningCritical';
import { VSpaceMed } from 'components/Dashboard/widgets/common';
import CredentialsRow from './CredentialsRow';

type GeneratedCredentialProps = {
  forward: () => void;
  wifkey: string;
  seed: string;
};

const GeneratedCredentialRoot = styled.div`
  position: relative;
  display: grid;
  justify-items: center;
  align-items: end;
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

const GeneratedCredential = ({ wifkey, seed, forward }: GeneratedCredentialProps) => {
  return (
    <GeneratedCredentialRoot>
      <h2>Your WIF and your Seed Phrase</h2>
      <Confidential>
        <CredentialsRow
          label="Seed Phrase"
          sublabel="- you wallet backup! store it safely!"
          credential={seed}
        />
        <CredentialsRow
          label="Your WIF/Private Key"
          sublabel="your private key, your coins/tokens"
          credential={wifkey}
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
      <VSpaceMed />
      <Button onClick={forward} customWidth="170px" theme="gray">
        Next
      </Button>
    </GeneratedCredentialRoot>
  );
};

export default GeneratedCredential;
