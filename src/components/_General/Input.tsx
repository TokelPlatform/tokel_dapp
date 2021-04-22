import React from 'react';

import styled from '@emotion/styled';

type StyledInputProps = {
  width: string;
  icon: boolean;
};

const StyledInput = styled.input<StyledInputProps>`
  background: var(--color-almostBlack);
  border: var(--border-dark);
  border-radius: var(--border-radius);
  height: 36px;
  width: ${props => props.width};
  padding-left: ${({ icon }) => (icon ? '2.25rem' : '0.5rem')};
  color: var(--color-white);
`;

const Icon = styled.img`
  position: absolute;
  margin: 0.5rem 0 0 0.75rem;
`;

type InputProps = {
  icon?: string;
  placeholder: string;
  value: string;
  autoFocus?: boolean;
  width?: string;
  onChange: (e) => void;
  onKeyDown: (e) => void;
};

const Input = ({ onChange, onKeyDown, value, icon, placeholder, autoFocus, width }: InputProps) => {
  return (
    <div>
      {icon && <Icon src={icon} />}
      <StyledInput
        id="inputbox"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        width={width}
        icon={icon !== ''}
      />
    </div>
  );
};

Input.defaultProps = {
  icon: '',
  autoFocus: true,
  width: '240px',
};
export default Input;
