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
  background: #222c3c;
  border: 1px solid #313d4f;
  border-radius: 4px;
`;
const SmallButton = ({ theme, onClick }: ButtonProps) => {
  return (
    <StyledButton onClick={onClick} theme={theme}>
      <img alt="arrow" src={arrowBack} />
    </StyledButton>
  );
};

export default SmallButton;
