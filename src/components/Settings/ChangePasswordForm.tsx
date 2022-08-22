import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { decrypt, encrypt } from 'encryption/core';
import { selectAccountWalletName } from 'store/selectors';

import ErrorMessage from 'components/_General/ErrorMessage';
import InputWithLabel from 'components/_General/InputWithLabel';
import { Subsection } from './Settings.common';

const ChangePasswordFormRoot = styled.div`
  width: 100%;
`;

const ChangePasswordForm = () => {
  const existingWalletName = useSelector(selectAccountWalletName);

  const [currentPass, setCurrentPass] = React.useState('');
  const [newPass, setNewPass] = React.useState('');
  const [newPassConfirm, setNewPassConfirm] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const changePassword = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (newPass !== newPassConfirm) {
        throw new Error("the new passwords don't match");
      }
      if (newPass.length < 8) {
        throw new Error('passwords must be at least 8 characters');
      }
      if (newPass === currentPass) {
        throw new Error('new password is unchanged');
      }
      const privKey = await decrypt(existingWalletName, Buffer.from(currentPass));
      await encrypt(existingWalletName, privKey.toString(), newPass);
      setError(null);
      setSuccess('password successfully set');
      setCurrentPass('');
      setNewPass('');
      setNewPassConfirm('');
      setTimeout(() => {
        setSuccess(null);
      }, 4000);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <ChangePasswordFormRoot>
      <Subsection name="Change Password" subtitle={success}>
        <InputWithLabel
          id="old-password"
          value={currentPass}
          type="password"
          onChange={e => setCurrentPass(e.target.value)}
          label="current password"
        />
        <InputWithLabel
          id="new-password"
          value={newPass}
          type="password"
          onChange={e => setNewPass(e.target.value)}
          label="new password"
        />
        <InputWithLabel
          id="confirm-password"
          value={newPassConfirm}
          type="password"
          onChange={e => setNewPassConfirm(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') changePassword();
          }}
          label="confirm new password"
          button={{
            text: 'SET',
            onClick: changePassword,
            loading,
          }}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Subsection>
    </ChangePasswordFormRoot>
  );
};

export default ChangePasswordForm;
