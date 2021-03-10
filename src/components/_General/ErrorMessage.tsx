import React from 'react';
import styled from '@emotion/styled';

type ErrorMessageProps = {
  children: string;
};
const StyledError = styled.p`
  height: 1rem;
  margin: 0.5rem 0;
  color: var(--color-danger);
`;

const ErrorMessage = ({ children }: ErrorMessageProps) => {
  return <StyledError>{children}</StyledError>;
};

export default ErrorMessage;
