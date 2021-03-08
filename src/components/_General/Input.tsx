import React from 'react';
import styled from '@emotion/styled';

type InputProps = {
  icon: string;
  placeholder: string;
  value: string;
  onChange: () => void;
};

const StyledInput = styled.input`
  background: var(--color-almostBlack);
  border: var(--border-dark);
  box-sizing: border-box;
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

const Input = ({ onChange, value, icon, placeholder }: InputProps) => {
  return (
    <div>
      <Icon src={icon} />
      <StyledInput
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
