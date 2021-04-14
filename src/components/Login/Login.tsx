import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import GeneratedCredential from './GeneratedCredentials';
import LoginForm from './LoginForm';
import ConfirmString from './ConfirmString';
import { getnewaddress, listnunspent, login } from '../../util/nspvlib';
import { sendInfo, showDash } from '../../util/electron';
import { setLoggedIn } from 'util/history';
import { Link } from 'react-router-dom';

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
  const [step, setStep] = useState(STEP1);
  const [key, setKey] = useState('Loading...');
  const [seed, setSeed] = useState('Loading...');

  useEffect(() => {
    if (step === STEP2) {
      (async () => {
        const result = await getnewaddress();
        setKey(result.wif);
        setSeed(result.seed);
      })();
    }
  }, [step]);

  const showDashboard = () => {
    login(key)
      .then(() => {
        return listnunspent();
      })
      .then((res) => {
        sendInfo(res);
        showDash();
        return 1;
      })
      .catch((e) => console.log(e));
  };
  const back = () => setStep(step - 1);
  const forward = () => setStep(step + 1);
  return (
    <LoginScreen>
      <button onClick={() => setLoggedIn(true)}>LOGIN OVERRIDE</button>
      <Link to="/">NOW GO</Link>
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
          forward={() => showDashboard()}
        />
      )}
    </LoginScreen>
  );
};

export default Login;
