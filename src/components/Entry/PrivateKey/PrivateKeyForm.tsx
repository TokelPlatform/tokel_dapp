import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import password from 'assets/password.svg';
import { dispatch } from 'store/rematch';
import { selectEnvError, selectLoginFeedback } from 'store/selectors';
import { BitgoAction, sendToBitgo } from 'util/bitgoHelper';
import { V } from 'util/theming';
import { ErrorMessages } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import ErrorMessage from 'components/_General/ErrorMessage';
import Input from 'components/_General/Input';
import Spinner from 'components/_General/Spinner';
import { BROKEN_WALLET_MSG } from 'components/BitgoOrchestrator';
import { VSpaceMed, VSpaceSmall } from 'components/Dashboard/widgets/common';

const LoginFormRoot = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
`;

const Feedback = styled.p`
  height: '1rem';
  color: ${V.color.frontSoft};
`;

const LoginForm = () => {
  const [loginValue, setLoginValue] = React.useState('');
  const [error, setError] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  const loginFeedback = useSelector(selectLoginFeedback);
  const envError = useSelector(selectEnvError);

  const performLogin = React.useCallback(() => {
    dispatch.environment.SET_ERROR(null);
    if (!loginValue) {
      setError(ErrorMessages.ENTER_WIF);
      return;
    }
    sendToBitgo(BitgoAction.LOGIN, { key: loginValue });
  }, [loginValue]);

  React.useEffect(() => {
    setError(envError);
    if (error || envError) {
      setShowSpinner(false);
    }
  }, [error, envError]);

  React.useEffect(() => {
    if (loginFeedback) {
      if (loginFeedback === BROKEN_WALLET_MSG) {
        setShowSpinner(false);
        setLoginValue('');
      } else {
        setShowSpinner(true);
      }
    }
  }, [loginFeedback]);

  return (
    <LoginFormRoot>
      <Input
        autoFocus
        onChange={e => {
          dispatch.environment.SET_LOGIN_FEEDBACK(null);
          setError('');
          setLoginValue(e.target.value);
        }}
        tid="wif-input"
        onKeyDown={e => e.key === 'Enter' && performLogin()}
        icon={password}
        value={loginValue}
        placeholder="Key or Seed Phrase"
        type="password"
        disabled={showSpinner}
      />
      <VSpaceSmall />
      <Button onClick={performLogin} theme="purple" disabled={showSpinner} data-tid="login-button">
        Login
      </Button>
      <VSpaceMed />
      <div style={{ height: '30px' }}>{showSpinner && <Spinner />}</div>
      <div style={{ marginBottom: '1rem', height: '3rem' }}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loginFeedback && (
          <Feedback style={loginFeedback === BROKEN_WALLET_MSG ? { color: V.color.cerise } : {}}>
            {loginFeedback}
          </Feedback>
        )}
      </div>
    </LoginFormRoot>
  );
};

export default LoginForm;
