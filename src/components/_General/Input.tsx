import React from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import ErrorMessage from './ErrorMessage';

const InputRoot = styled.div`
  display: flex;
  align-items: center;
`;

type StyledInputProps = {
  width: string;
  icon?: boolean;
  disabled: boolean;
};

export const StyledInput = styled.input<StyledInputProps>`
  background: var(--color-black);
  border: var(--border-dark);
  border-radius: var(--border-radius);
  height: 40px;
  padding-left: ${({ icon }) => (icon ? '2.25rem' : '0.75rem')};
  color: var(--color-white);
  ${({ width }) => (width === 'flex' ? { flexGrow: 1 } : { width })}
  ${({ disabled }) =>
    disabled
      ? css`
          pointer-events: none;
          opacity: 0.9;
          color: var(--color-gray);
        `
      : ''}
`;

export const IconImg = styled.img`
  position: absolute;
  margin-left: 0.7rem;
`;

type InputProps = {
  id?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  icon?: string;
  placeholder?: string;
  autoFocus?: boolean;
  width?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
  tid?: string;
};

const Input = ({
  id,
  value,
  onChange,
  onKeyDown,
  icon,
  placeholder,
  autoFocus,
  width = '240px',
  type = 'text',
  disabled,
  error,
  tid,
}: InputProps) => {
  return (
    <InputRoot>
      {icon && <IconImg src={icon} />}
      <StyledInput
        id={id}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        width={width}
        icon={icon !== ''}
        type={type}
        data-tid={tid}
        disabled={disabled}
      />
      {error && (
        <div style={{ textAlign: 'right' }}>
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}
    </InputRoot>
  );
};

export default Input;
