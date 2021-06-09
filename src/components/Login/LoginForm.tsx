import React, { useCallback, useEffect, useState } from 'react';

import styled from '@emotion/styled';

import password from 'assets/password.svg';
import { dispatch } from 'store/rematch';

import { Button } from 'components/_General/buttons';
import ErrorMessage from 'components/_General/ErrorMessage';
import Input from 'components/_General/Input';
import Link from 'components/_General/Link';
import Logo from 'components/_General/Logo';
import Spinner from 'components/_General/Spinner';
import { VSpaceMed, VSpaceSmall } from 'components/Dashboard/widgets/common';

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

const Feedback = styled.p`
  height: '1rem';
  color: var(--color-gray);
`;

const LoginForm = ({ addNewWallet }: LoginFormProps) => {
  const [loginValue, setloginValue] = useState('');
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);

  const performLogin = useCallback(() => {
    setShowSpinner(true);
    dispatch.account.login({ key: loginValue, setError, setFeedback });
  }, [loginValue]);

  useEffect(() => {
    if (error) {
      setShowSpinner(false);
    }
  }, [error]);

  return (
    <Container>
      <Logo />
      <h1>Welcome to TOKEL</h1>
      <p className="welcome">Komodo ecosystem Token Platform</p>
      <Input
        autoFocus
        onChange={e => setloginValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && performLogin()}
        icon={password}
        value={loginValue}
        placeholder="Key or Seed Phrase"
        disabled={showSpinner}
      />
      <VSpaceSmall />
      <Button
        onClick={performLogin}
        theme="purple"
        disabled={showSpinner}
      >
        Login
      </Button>
      <VSpaceMed />
      <div style={{ height: '30px' }}>{showSpinner && <Spinner />}</div>
      <div style={{ marginBottom: '1rem', height: '3rem' }}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {feedback && <Feedback>{feedback}</Feedback>}
      </div>
      <Link onClick={addNewWallet} linkText="Generate New Address" />
    </Container>
  );
};

export default LoginForm;
