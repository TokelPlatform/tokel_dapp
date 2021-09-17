import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';

import password from 'assets/password.svg';
import { dispatch } from 'store/rematch';
import { selectEnvError, selectLoginFeedback } from 'store/selectors';
import { login } from 'util/workerHelper';
import { BITGO, ErrorMessages } from 'vars/defines';

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
  const [showSpinner, setShowSpinner] = useState(false);
  const loginFeedback = useSelector(selectLoginFeedback);
  const envError = useSelector(selectEnvError);

  const performLogin = useCallback(() => {
    dispatch.environment.SET_ERROR(null);
    if (!loginValue) {
      setError(ErrorMessages.ENTER_WIF);
      return;
    }
    ipcRenderer.send(BITGO, login(loginValue));
  }, [loginValue]);

  useEffect(() => {
    setError(envError);
    if (error || envError) {
      setShowSpinner(false);
    }
  }, [error, envError]);

  useEffect(() => {
    if (loginFeedback) {
      setShowSpinner(true);
    }
  }, [loginFeedback, showSpinner]);

  return (
    <LoginFormRoot>
      <h1>Welcome to Tokel</h1>
      <p className="welcome">Future of tokenization</p>
      <Input
        autoFocus
        onChange={e => {
          setError('');
          setloginValue(e.target.value);
        }}
        onKeyDown={e => e.key === 'Enter' && performLogin()}
        icon={password}
        value={loginValue}
        placeholder="Key or Seed Phrase"
        disabled={showSpinner}
      />
      <VSpaceSmall />
      <Button onClick={performLogin} theme="purple" disabled={showSpinner}>
        Login
      </Button>
      <VSpaceMed />
      <div style={{ height: '30px' }}>{showSpinner && <Spinner />}</div>
      <div style={{ marginBottom: '1rem', height: '3rem' }}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loginFeedback && <Feedback>{loginFeedback}</Feedback>}
      </div>
      <Link onClick={addNewWallet} linkText="Generate New Address" />
    </LoginFormRoot>
  );
};

export default LoginForm;
