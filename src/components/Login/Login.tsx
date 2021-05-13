import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { getNewAddress } from 'util/nspvlib';

import ConfirmString from './ConfirmString';
import GeneratedCredential from './GeneratedCredentials';
import LoginForm from './LoginForm';

const LoginScreen = styled.div`
  margin-top: -10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    margin: 0;
    color: var(--color-white);
    font-weight: 400;
  }
`;

const STEP1 = 1;
const STEP2 = 2;
const STEP3 = 3;
const STEP4 = 4;

const Login = () => {
  const [step, setStep] = useState(STEP1);
  const [key, setKey] = useState('Loading...');
  const [seed, setSeed] = useState('Loading...');

  useEffect(() => {
    if (step === STEP2) {
      (async () => {
        const result = await getNewAddress();
        setKey(result.wif);
        setSeed(result.seed);
      })();
    }
  }, [step]);

  const back = () => setStep(step - 1);
  const forward = () => setStep(step + 1);
  return (
    <LoginScreen>
      {step === STEP1 && <LoginForm addNewWallet={() => forward()} />}
      {step === STEP2 && (
        <GeneratedCredential
          wifkey={key}
          seed={seed}
          goBack={() => back()}
          forward={() => forward()}
        />
      )}
      {step === STEP3 && (
        <ConfirmString
          title="Confirm Your Key"
          desc="Your key is important for you to login to your account. Make sure you copied it to a safe place. Please confirm it."
          originalString={key}
          goBack={() => back()}
          forward={() => forward()}
        />
      )}
      {step === STEP4 && (
        <ConfirmString
          title="Confirm Your Seed Phrase"
          desc="You will use your seed phrase in case you need to restore access to your account. Please confirm it."
          originalString={seed}
          goBack={() => back()}
          forward={() => dispatch.account.login({ key, setError: console.log })}
        />
      )}
    </LoginScreen>
  );
};

export default Login;
