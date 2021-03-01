import React, { useState } from 'react';
import styled from '@emotion/styled';
import Input from '../Input';
import Button from '../Button';
import SmallButton from '../SmallButton';
import { password, copy, warning } from '../../data/icons';

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
const Logo = styled.img`
  height: 50px;
  width: 50px;
  margin-bottom: 1.5rem;
`;

const LoginStep1 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    color: var(--color-gray);
    font-weight: 400;
    margin: 0;
    margin-bottom: 1rem;
  }
  button {
    margin-bottom: 3rem;
  }
`;

const LoginStep2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button:nth-of-type(1) {
    position: absolute;
    left: 8.75rem;
    top: 6.75rem;
    cursor: pointer;
  }
`;

const Confidential = styled.div`
  margin: 1rem 0;
  padding: 0.5rem 1.5em;
  height: 124px;
  width: 468px;
  background: rgba(248, 7, 89, 0.05);
  border: 1px solid var(--color-danger);
  box-sizing: border-box;
  border-radius: var(--border-radius);
`;

const Label = styled.p`
  color: var(--color-gray);
  margin: 0.5rem 0 0 0;
  font-size: 12px;
  span {
    opacity: 0.7;
  }
`;
const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  p {
    margin: 0 0.5rem 0 0;
    font-size: var(--font-size-additional-p);
    color: var(--color-danger);
    // font-weight: 600;
    width: 400px;
  }
`;
const Warning = styled.div`
  display: flex;
  flex-direction: row;
  img {
    margin-right: 0.5rem;
  }
  h3,
  p {
    margin: 0;
  }
  h3 {
    color: var(--color-white);
    font-weight: 400;
  }
  p {
    color: var(--color-gray);
    font-size: var(--font-size-additional-p);
  }
  margin-bottom: 1rem;
`;

const STEP1 = 'login';
const STEP2 = 'seed-copy';
// const STEP3 = 'seed-confirm';

const Login = () => {
  const [step, setStep] = useState(STEP1);

  const addNewWallet = () => setStep(STEP2);
  const goBack = () => setStep(STEP1);

  return (
    <LoginScreen>
      {step === STEP1 && (
        <LoginStep1>
          <Logo alt="tokel-logo" src="../assets/logo.png" />
          <h1>Welcome to TOKEL</h1>
          <p>Komodo ecosystem Token Platform</p>
          <Input icon={password} placeholder="Key or Seed Phrase" />
          <Button theme="purple" buttonText="Login" />
          <button type="button" onClick={addNewWallet}>
            {/* <a onClick={addNewWallet} href="#"> */}
            Add New Wallet
          </button>
        </LoginStep1>
      )}
      {step === STEP2 && (
        <LoginStep2>
          <Logo alt="tokel-logo" src="../assets/logo.png" />
          <SmallButton onClick={goBack} />
          <h1>Your WIF and your Seed Phrase</h1>
          <Confidential>
            <Label>
              Your KEY{' '}
              <span> - private key and is used to login to your wallet</span>
            </Label>
            <Info>
              <p>UqcurF1CAR73USkspg825FcnMYCduP2zpBBVoVaF7PPSyQgDx632</p>
              <img alt="copy" src={copy} />
            </Info>
            <Label>
              Seed phrase <span> - can be used as a backup login option</span>
            </Label>
            <Info>
              <p>
                advanced adequate approach generate generous here keyboards
                momentum profound somebody wherever whatever{' '}
              </p>
              <img alt="copy" src={copy} />
            </Info>
          </Confidential>
          <Warning>
            <img alt="warning" src={warning} />
            <div>
              <h3>Important: please back up your seed phrase and WIF now!</h3>
              <p>
                We recommend storing it offline.{' '}
                <a href="/">Learn security best practices</a>
              </p>
            </div>
          </Warning>
          <Button customWidth="170px" buttonText="Next" theme="gray" />
        </LoginStep2>
      )}
    </LoginScreen>
  );
};

export default Login;
