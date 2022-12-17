import React from 'react';

import styled from '@emotion/styled';

import { encrypt } from 'encryption/core';
import { dispatch } from 'store/rematch';

import ErrorMessage from 'components/_General/ErrorMessage';
import InputWithLabel from 'components/_General/InputWithLabel';

const CreatePasswordedWalletFormRoot = styled.div`
  padding-bottom: 30px;
`;

interface CreatePasswordedWalletFormProps {
  onSubmit: (newWalletName: string) => void;
}

const CreatePasswordedWalletForm = ({ onSubmit }: CreatePasswordedWalletFormProps) => {
  const [privateKey, setPrivateKey] = React.useState('');
  const [walletName, setWalletName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passConfirm, setPassConfirm] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const createWallet = async () => {
    setLoading(true);
    try {
      if (walletName.length === 0) {
        throw new Error('wallet name is required');
      }
      if (walletName.includes(' ')) {
        throw new Error('wallet name cannot contain spaces');
      }
      if (password !== passConfirm) {
        throw new Error("the new passwords don't match");
      }
      if (password.length < 8) {
        throw new Error('passwords must be at least 8 characters');
      }
      await encrypt(walletName, privateKey, password);
      await dispatch.account.loadWallets();
      onSubmit(walletName);
      setPrivateKey('');
      setWalletName('');
      setPassword('');
      setPassConfirm('');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <CreatePasswordedWalletFormRoot>
      <InputWithLabel
        id="wallet-name"
        value={walletName}
        onChange={e => setWalletName(e.target.value)}
        label="wallet name"
      />
      <InputWithLabel
        id="private-key"
        value={privateKey}
        type="password"
        onChange={e => setPrivateKey(e.target.value)}
        label="private key"
      />
      <InputWithLabel
        id="new-password"
        value={password}
        type="password"
        onChange={e => setPassword(e.target.value)}
        label="password"
      />
      <InputWithLabel
        id="confirm-password"
        value={passConfirm}
        type="password"
        label="confirm password"
        onChange={e => setPassConfirm(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && createWallet()}
        button={{
          text: 'GO',
          onClick: createWallet,
          loading,
        }}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </CreatePasswordedWalletFormRoot>
  );
};

export default CreatePasswordedWalletForm;
