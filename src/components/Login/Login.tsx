import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { getNewAddress } from 'util/nspvlib';
import { TOPBAR_HEIGHT } from 'vars/defines';

import Spinner from 'components/_General/Spinner';
import ConfirmString from './ConfirmString';
import GeneratedCredential from './GeneratedCredentials';
import LoginForm from './LoginForm';

const LoginRoot = styled.div`
  width: 100%;
  height: calc(100% - ${TOPBAR_HEIGHT}px);
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

type ProgressProps = {
  width: string;
};

const ProgressBarAnimation = styled.div<ProgressProps>`
  position: absolute;
  top: 0px;
  left: 0px;
  height: 5px;
  width: ${props => props.width ?? '0%'};
  background: var(--gradient-purple-horizontal);
  transition: 0.3s;
`;

const STEP1 = 1;
const STEP2 = 2;
const STEP3 = 3;
const STEP4 = 4;
const STEP5 = 5;

const Login = () => {
  const [step, setStep] = useState(STEP1);
  const [key, setKey] = useState(null);
  const [seed, setSeed] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (key && seed) {
      return;
    }
    if (step === STEP2) {
      (async () => {
        const result = await getNewAddress();
        setKey(result.wif);
        setSeed(result.seed);
      })();
    }
  }, [step, key, seed]);

  const back = () => setStep(step - 1);
  const forward = () => setStep(step + 1);
  return (
    <LoginRoot>
      <ProgressBarAnimation width={`${(step - 1) * 25}%`} />
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
      {(step === STEP4 || step === STEP5) && (
        <ConfirmString
          title="Confirm Your Seed Phrase"
          desc="You will use your seed phrase in case you need to restore access to your account. Please confirm it."
          originalString={seed}
          goBack={() => back()}
          forward={() => {
            forward();
            setShowSpinner(true);
            dispatch.account.login({ key, setError: console.log, setFeedback });
          }}
        />
      )}
      <div style={{ height: '30px' }}>{showSpinner && <Spinner />}</div>
    </LoginRoot>
  );
};

export default Login;
