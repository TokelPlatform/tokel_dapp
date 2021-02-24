import React from 'react';
import styled from '@emotion/styled';

type ButtonProps = {
  buttonText: string;
};
const StyledButton = styled.button`
  width: 240px;
  height: 40px;
  background: var(--gradient-purple-direct);
  border-radius: 4px;
  border: none;
  color: var(--color-white);
  font-size: 14px;
  font-weight: 600;
  &:focus {
    outline: none;
  }
`;
const Button = ({ buttonText }: ButtonProps) => {
  return <StyledButton>{buttonText}</StyledButton>;
};

export default Button;
