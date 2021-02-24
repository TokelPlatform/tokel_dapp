import React from 'react';
import styled from '@emotion/styled';
import Input from '../Input';
import Button from '../Button';

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
  }
  h2 {
    margin: 0;
    color: var(--color-white);
  }
`;
const Login = () => {
  return (
    <LoginScreen>
      <img alt="tokel-logo" height="50px" src="../assets/logo.png" />
      <h2>Welcome to TOKEL</h2>
      <p>Komodo ecosystem Token Platform</p>
      <Input />
      <Button buttonText="Login" />
      <a href="/">Add new wallet</a>
    </LoginScreen>
  );
};

export default Login;
