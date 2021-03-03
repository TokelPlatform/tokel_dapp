import React from 'react';
import styled from '@emotion/styled';
import Input from '../_General/Input';
import Button from '../_General/Button';
import password from './assets/password.svg';
import Link from '../_General/Link';
import Logo from '../_General/Logo';

type LoginFormProps = {
  addNewWallet: () => void;
};

const Container = styled.div`
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

const LoginForm = ({ addNewWallet }: LoginFormProps) => {
  return (
    <Container>
      <Logo />
      <h1>Welcome to TOKEL</h1>
      <p>Komodo ecosystem Token Platform</p>
      <Input icon={password} placeholder="Key or Seed Phrase" />
      <Button
        onClick={() => console.log('yay')}
        theme="purple"
        buttonText="Login"
      />
      <Link onClick={addNewWallet} linkText="Add New Wallet" />
    </Container>
  );
};

export default LoginForm;
