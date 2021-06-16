import React from 'react';

import styled from '@emotion/styled';

type StyledInputProps = {
  width: string;
  icon: boolean;
  disabled: boolean;
};

const StyledInput = styled.input<StyledInputProps>`
  background: var(--color-black);
  border: var(--border-dark);
  border-radius: var(--border-radius);
  height: 36px;
  width: ${props => props.width};
  padding-left: ${({ icon }) => (icon ? '2.25rem' : '0.75rem')};
  color: var(--color-white);
  ${props => (props.disabled ? 'pointer-events: none; opacity: 0.9; color: var(--color-gray)' : '')}
`;

const Icon = styled.img`
  position: absolute;
  margin: 0.5rem 0 0 0.75rem;
`;

type InputProps = {
  id?: string;
  icon?: string;
  placeholder: string;
  value: string;
  autoFocus?: boolean;
  width?: string;
  type?: string;
  onChange: (e) => void;
  onKeyDown: (e) => void;
  disabled?: boolean;
};

const Input = ({
  onChange,
  onKeyDown,
  value,
  icon,
  placeholder,
  autoFocus,
  width,
  id,
  type,
  disabled,
}: InputProps) => {
  return (
    <div>
      {icon && <Icon src={icon} />}
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
        disabled={disabled}
      />
    </div>
  );
};

Input.defaultProps = {
  id: '',
  icon: '',
  autoFocus: false,
  width: '240px',
  type: 'text',
};
export default Input;
