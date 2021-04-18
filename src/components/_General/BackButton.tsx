import React from 'react';

import styled from '@emotion/styled';

import arrowBack from 'assets/arrowBack.svg';

const BackButtonRoot = styled.button`
  width: 36px;
  height: 36px;
  background: var(--color-almostBlack);
  border: var(--border-dark);
  border-radius: var(--border-radius);
  &:hover {
    background-color: var(--color-almostBlack2);
  }
`;

type BackButtonProps = {
  onClick: () => void;
};

const BackButton = ({ onClick }: BackButtonProps) => (
  <BackButtonRoot onClick={onClick}>
    <img alt="arrow" src={arrowBack} />
  </BackButtonRoot>
);

export default BackButton;
