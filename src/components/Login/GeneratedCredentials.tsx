import React from 'react';
import styled from '@emotion/styled';
import Button from '../_General/Button';
import SmallButton from '../_General/SmallButton';
import CredentialsRow from './CredentialsRow';
import Warning from './Warning';
import Logo from '../_General/Logo';

type GeneratedCredentialProps = {
  goBack: () => void;
  forward: () => void;
  wifkey: string;
  seed: string;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BtnWrapper = styled.div`
  position: absolute;
  left: 8.75rem;
  top: 5.5rem;
  cursor: pointer;
`;

const Confidential = styled.div`
  margin: 1rem 0;
  padding: 0.5rem 1.5em;
  height: 124px;
  width: 468px;
  background: rgba(248, 7, 89, 0.05);
  border: 1px solid var(--color-danger);
  box-sizing: border-box;
  border-radius: var(--border-radius);
`;

const GeneratedCredential = ({
  wifkey,
  seed,
  forward,
  goBack,
}: GeneratedCredentialProps) => {
  return (
    <Container>
      <Logo />
      <BtnWrapper>
        <SmallButton onClick={goBack} />
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
      <Warning />

      <Button
        onClick={forward}
        customWidth="170px"
        buttonText="Next"
        theme="gray"
      />
    </Container>
  );
};

export default GeneratedCredential;
