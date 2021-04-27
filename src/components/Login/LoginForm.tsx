import React, { useCallback, useState } from 'react';

import styled from '@emotion/styled';

import password from 'assets/password.svg';
import { dispatch } from 'store/rematch';

import { Button } from 'components/_General/buttons';
import ErrorMessage from 'components/_General/ErrorMessage';
import Input from 'components/_General/Input';
import Link from 'components/_General/Link';
import Logo from 'components/_General/Logo';
import { VSpaceSmall } from 'components/Dashboard/widgets/common';

type LoginFormProps = {
  addNewWallet: () => void;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .welcome {
    color: var(--color-gray);
    font-weight: 400;
    margin: 0;
    margin-bottom: 1rem;
  }
  button {
    margin-bottom: 0rem;
  }
`;

const LoginForm = ({ addNewWallet }: LoginFormProps) => {
  const [loginValue, setloginValue] = useState('');
  const [error, setError] = useState('');

  const handleKeyDown = useCallback(
    e => e.key === 'Enter' && dispatch.account.login({ key: loginValue, setError }),
    [loginValue, setError]
  );

  return (
    <Container>
      <Logo />
      <h1>Welcome to TOKEL</h1>
      <p className="welcome">Komodo ecosystem Token Platform</p>
      <Input
        autoFocus
        onChange={e => setloginValue(e.target.value)}
        onKeyDown={handleKeyDown}
        icon={password}
        value={loginValue}
        placeholder="Key or Seed Phrase"
      />
      <VSpaceSmall />
      <Button onClick={() => dispatch.account.login({ key: loginValue, setError })} theme="purple">
        Login
      </Button>
      <div style={{ marginBottom: '2rem' }}>
        <ErrorMessage>{error}</ErrorMessage>
      </div>
      <Link onClick={addNewWallet} linkText="Add New Wallet" />
    </Container>
  );
};

export default LoginForm;
