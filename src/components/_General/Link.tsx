import React from 'react';

import styled from '@emotion/styled';

type InputProps = {
  linkText: string;
  onClick: () => void;
};

const Styled = styled.button`
  border: none;
  color: var(--color-link);
  text-decoration: underline;
  background-color: transparent;
  font-size: var(--font-size-p);
  transition: 0.2s;

  &:hover {
    color: var(--color-link-hover);
  }
`;

const Link = ({ linkText, onClick }: InputProps) => {
  return (
    <Styled type="button" onClick={onClick}>
      {linkText}
    </Styled>
  );
};

export default Link;
