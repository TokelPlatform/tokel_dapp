import React, { useState } from 'react';
import styled from '@emotion/styled';
import GeneratedCredential from './GeneratedCredentials';
import LoginForm from './LoginForm';

const LoginScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5rem;
  h1 {
    margin: 0;
    color: var(--color-white);
    font-weight: 400;
  }
`;

const STEP1 = 'login';
const STEP2 = 'seed-copy';
// const STEP3 = 'seed-confirm';

const Login = () => {
  const [step, setStep] = useState(STEP1);

  const addNewWallet = () => setStep(STEP2);
  return (
    <LoginScreen>
      {step === STEP1 && <LoginForm addNewWallet={addNewWallet} />}
      {step === STEP2 && <GeneratedCredential goBack={() => setStep(STEP1)} />}
    </LoginScreen>
  );
};

export default Login;
