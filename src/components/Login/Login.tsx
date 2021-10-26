import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import ToggleIcon from 'assets/Toggle.svg';
import { dispatch } from 'store/rematch';
import { selectKey, selectSeed } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { V } from 'util/theming';
import { TOPBAR_HEIGHT_PX } from 'vars/defines';

import Logo from 'components/_General/Logo';
import Spinner from 'components/_General/Spinner';
import ConfirmString from './ConfirmString';
import GeneratedCredential from './GeneratedCredentials';
import LoginForm from './LoginForm';

const LoginRoot = styled.div`
  width: 100%;
  height: calc(100% - ${TOPBAR_HEIGHT_PX}px);
  display: grid;
  grid-template-rows: 28% 45%;
  justify-items: center;
  align-items: center;
  h1 {
    margin: 1rem 0 1rem 0;
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

const NetworkPrefsButton = styled.button`
  position: absolute;
  top: 14px;
  right: 20px;
  background-color: none;
  border: none;
  height: 18px;
  width: 18px;
  background: ${V.color.frontSoft};
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
  mask-image: url('${ToggleIcon}');
  cursor: pointer;
  &:hover {
    background: ${V.color.front};
  }
`;

const STEP1 = 1;
const STEP2 = 2;
const STEP3 = 3;
const STEP4 = 4;
const STEP5 = 5;

const Login = () => {
  const [step, setStep] = useState(STEP1);
  const [showSpinner, setShowSpinner] = useState(false);
  const key = useSelector(selectKey);
  const seed = useSelector(selectSeed);

  useEffect(() => {
    if (step === STEP2) {
      sendToBitgo(BitgoAction.NEW_ADDRESS);
    }
  }, [step]);

  const back = () => setStep(step - 1);
  const forward = () => setStep(step + 1);
  return (
    <LoginRoot>
      <ProgressBarAnimation width={`${(step - 1) * 25}%`} />
      <div style={{ marginTop: '10rem', marginBottom: 0 }}>
        <Logo />
      </div>
      <NetworkPrefsButton onClick={() => dispatch.environment.TOGGLE_SHOW_NETWORK_PREFS()} />
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
          title="Confirm Your Seed Phrase"
          desc="You will use your seed phrase in case you need to restore access to your account. Please confirm it."
          originalString={seed}
          goBack={() => back()}
          forward={() => forward()}
        />
      )}
      {(step === STEP4 || step === STEP5) && (
        <ConfirmString
          title="Confirm Your WIF/Private Key"
          desc="Your key is important for you to login to your account. Make sure you copied it to a safe place. Please confirm it."
          originalString={key}
          goBack={() => back()}
          forward={() => {
            forward();
            setShowSpinner(true);
            sendToBitgo(BitgoAction.LOGIN, { key });
          }}
        />
      )}
      <div style={{ height: '30px' }}>{showSpinner && <Spinner />}</div>
    </LoginRoot>
  );
};

export default Login;
