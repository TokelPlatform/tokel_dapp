import React from 'react';
import styled from '@emotion/styled';

type ButtonProps = {
  buttonText: string;
  theme: string;
  customWidth?: string;
  onClick: (e) => void;
};

type StyledButtonProps = {
  theme: string;
  customWidth?: string;
};

const defaultProps = {
  customWidth: '240px',
};

const StyledButton = styled.button<StyledButtonProps>`
  width: ${(props) => props.customWidth};
  height: 40px;
  background: ${(props) =>
    props.theme === 'purple'
      ? 'var(--gradient-purple-direct)'
      : 'var(--gradient-gray)'};
  border-radius: var(--border-radius);
  border: none;
  color: var(--color-white);
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;
const Button = ({ buttonText, theme, customWidth, onClick }: ButtonProps) => {
  return (
    <StyledButton onClick={onClick} theme={theme} customWidth={customWidth}>
      {buttonText}
    </StyledButton>
  );
};

Button.defaultProps = defaultProps;
export default Button;
