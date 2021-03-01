import React from 'react';
import styled from '@emotion/styled';
import { arrowBack } from '../data/icons';

type ButtonProps = {
  theme: string;
  onClick: () => void;
};
const StyledButton = styled.button`
  width: 36px;
  height: 36px;
  background: var(--color-almostBlack);
  border: var(--border-dark);
  border-radius: var(--border-radius);
  &:hover {
    background-color: var(--color-almostBlack2);
  }
`;
const SmallButton = ({ theme, onClick }: ButtonProps) => {
  return (
    <StyledButton onClick={onClick} theme={theme}>
      <img alt="arrow" src={arrowBack} />
    </StyledButton>
  );
};

export default SmallButton;
