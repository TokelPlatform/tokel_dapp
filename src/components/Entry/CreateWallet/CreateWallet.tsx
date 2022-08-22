import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectKey, selectSeed } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';

import Spinner from 'components/_General/Spinner';
import ConfirmString from './ConfirmString';
import GeneratedCredential from './GeneratedCredentials';

interface ProgressProps {
  width: string;
}

const ProgressBarAnimation = styled.div<ProgressProps>`
  position: fixed;
  top: 0px;
  left: 0px;
  height: 5px;
  width: ${props => props.width ?? '0%'};
  background: var(--gradient-purple-horizontal);
  transition: 0.3s;
`;

const CreateWalletRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const STEP1 = 1;
const STEP2 = 2;
const STEP3 = 3;
const STEP4 = 4;

const CreateWallet = () => {
  const [step, setStep] = React.useState(STEP1);
  const back = () => setStep(step - 1);
  const forward = () => setStep(step + 1);

  const [showSpinner, setShowSpinner] = React.useState(false);
  const key = useSelector(selectKey);
  const seed = useSelector(selectSeed);

  React.useEffect(() => {
    if (step === STEP1) {
      sendToBitgo(BitgoAction.NEW_ADDRESS);
    }
  }, [step]);

  return (
    <CreateWalletRoot>
      <ProgressBarAnimation width={`${(step - 1) * 25}%`} />
      {step === STEP1 && <GeneratedCredential wifkey={key} seed={seed} forward={forward} />}
      {step === STEP2 && (
        <ConfirmString
          title="Confirm Your Seed Phrase"
          desc="You will use your seed phrase in case you need to restore access to your account. Please confirm it."
          originalString={seed}
          goBack={back}
          forward={forward}
        />
      )}
      {(step === STEP3 || step === STEP4) && (
        <ConfirmString
          title="Confirm Your WIF/Private Key"
          desc="Your key is important for you to login to your account. Make sure you copied it to a safe place. Please confirm it."
          originalString={key}
          goBack={() => {
            back();
            setShowSpinner(false);
          }}
          forward={() => {
            forward();
            setShowSpinner(true);
            sendToBitgo(BitgoAction.LOGIN, { key });
          }}
        />
      )}
      <div style={{ height: '30px' }}>{showSpinner && <Spinner />}</div>
    </CreateWalletRoot>
  );
};

export default CreateWallet;
