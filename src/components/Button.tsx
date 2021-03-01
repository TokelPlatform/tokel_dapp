import React from 'react';
import styled from '@emotion/styled';

type ButtonProps = {
  buttonText: string;
  theme: string;
};
const StyledButton = styled.button`
  width: 240px;
  height: 40px;
  background: ${(props) =>
    props.theme === 'purple'
      ? 'var(--gradient-purple-direct)'
      : 'var(--gradient-gray)'};
  border-radius: 4px;
  border: none;
  color: var(--color-white);
  font-size: 14px;
  font-weight: 400;
  &:focus {
    outline: none;
  }
`;
const Button = ({ buttonText, theme }: ButtonProps) => {
  return <StyledButton theme={theme}>{buttonText}</StyledButton>;
};

export default Button;
