import React from 'react';

import styled from '@emotion/styled';

const StyledInput = styled.input`
  background: var(--color-almostBlack);
  border: var(--border-dark);
  border-radius: var(--border-radius);
  margin: 0.75rem;
  height: 36px;
  width: 240px;
  padding-left: 2rem;
  color: var(--color-white);
`;

const Icon = styled.img`
  position: absolute;
  margin: 1.35rem 0 0 1.5rem;
`;

type InputProps = {
  icon: string;
  placeholder: string;
  value: string;
  autoFocus: boolean;
  onChange: (e) => void;
  onKeyDown: (e) => void;
};

const Input = ({ onChange, onKeyDown, value, icon, placeholder, autoFocus }: InputProps) => {
  return (
    <div>
      <Icon src={icon} />
      <StyledInput
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default Input;
