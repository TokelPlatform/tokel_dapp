import React, { useCallback, useEffect, useState } from 'react';

import styled from '@emotion/styled';

import password from 'assets/password.svg';
import { dispatch } from 'store/rematch';

import { Button } from 'components/_General/buttons';
import ErrorMessage from 'components/_General/ErrorMessage';
import Input from 'components/_General/Input';
import Link from 'components/_General/Link';
import Spinner from 'components/_General/Spinner';
import { VSpaceMed, VSpaceSmall } from 'components/Dashboard/widgets/common';

type LoginFormProps = {
  addNewWallet: () => void;
};

const LoginFormRoot = styled.div`
  display: grid;
  grid-template-rows: 20% 7% 15% 3%;
  justify-items: center;
  align-items: end;
  .welcome {
    color: var(--color-gray);
    font-weight: 400;
    margin: 0;
    margin-bottom: 1rem;
  }
  h1 {
    margin-top: 1rem;
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
    if (!loginValue || loginValue === '') {
      return;
    }
    setShowSpinner(true);
    dispatch.account.login({ key: loginValue, setError, setFeedback });
  }, [loginValue]);

  useEffect(() => {
    if (error) {
      setShowSpinner(false);
    }
  }, [error]);

  return (
    <LoginFormRoot>
      <h1>Welcome to TOKEL</h1>
      <p className="welcome">Komodo ecosystem Token Platform</p>
      <Input
        autoFocus
        onChange={e => setloginValue(e.target.value)}
        onKeyDown={performLogin}
        icon={password}
        value={loginValue}
        placeholder="Key or Seed Phrase"
        disabled={showSpinner}
      />
      <VSpaceSmall />
      <Button
        onClick={() => {
          setShowSpinner(true);
          dispatch.account.login({ key: loginValue, setError, setFeedback });
        }}
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
    </LoginFormRoot>
  );
};

export default LoginForm;
