import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import GeneratedCredential from './GeneratedCredentials';
import LoginForm from './LoginForm';
import ConfirmString from './ConfirmString';

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

const STEP1 = 1;
const STEP2 = 2;
const STEP3 = 3;
const STEP4 = 4;

const Login = () => {
  const [step, setStep] = useState(STEP2);
  const [key, setKey] = useState(
    'UqcurF1CAR73USkspg825FcnMYCduP2zpBBVoVaF7PPSyQgDx632'
  );
  const [seed, setSeed] = useState(
    'advanced adequate approach generate generous here keyboards momentum profound somebody wherever whatever'
  );

  useEffect(() => {
    setKey('UqcurF1CAR73USkspg825FcnMYCduP2zpBBVoVaF7PPSyQgDx632');
    setSeed(
      'advanced adequate approach generate generous here keyboards momentum profound somebody wherever whatever'
    );
  }, []);

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
          originalString="x"
          goBack={() => back()}
          forward={() => forward()}
        />
      )}
      {step === STEP4 && (
        <ConfirmString
          title="Confirm Your Seed Phrase"
          desc="You will use your seed phrase in case you need to restore access to your account. Please confirm it."
          originalString="x"
          goBack={() => back()}
          forward={() => forward()}
        />
      )}
    </LoginScreen>
  );
};

export default Login;
