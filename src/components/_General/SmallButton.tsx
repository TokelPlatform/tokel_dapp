import React from 'react';
import styled from '@emotion/styled';
import arrowBack from './assets/arrowBack.svg';

type ButtonProps = {
  onClick: () => void;
};
const StyledButton = styled.button`
  width: 36px;
  height: 36px;
  background: var(--color-almostBlack);
  border: var(--border-dark);
  border-radius: var(--border-radius);
  cursor: pointer;
  &:hover {
    background-color: var(--color-almostBlack2);
  }
`;
const SmallButton = ({ onClick }: ButtonProps) => {
  return (
    <StyledButton onClick={onClick}>
      <img alt="arrow" src={arrowBack} />
    </StyledButton>
  );
};

export default SmallButton;
