import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Input from '../Input';
import Button from '../Button';
import password from '../../../assets/icons/password.svg';

const LoginScreen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 6rem;

  p {
    color: var(--color-gray);
    font-weight: 400;
    margin: 0;
    margin-bottom: 1rem;
  }
  h1 {
    margin: 0;
    color: var(--color-white);
    font-weight: 400;
  }
`;
const Logo = styled.img`
  height: 50px;
  margin-bottom: 1.5rem;
`;
const buttonStyle = css`
  margin-bottom: 1rem;
`;

const Login = () => {
  return (
    <LoginScreen>
      <Logo alt="tokel-logo" src="../assets/logo.png" />
      <h1>Welcome to TOKEL</h1>
      <p>Komodo ecosystem Token Platform</p>
      <Input icon={password} placeholder="Key or Seed Phrase" />
      <Button css={buttonStyle} buttonText="Login" />
      <a href="/">Add New Wallet</a>
    </LoginScreen>
  );
};

export default Login;
