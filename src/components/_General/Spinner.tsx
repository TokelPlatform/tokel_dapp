import React from 'react';

import styled from '@emotion/styled';

const SpinnerRoot = styled.div`
  @keyframes spin {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(359deg);
    }
  }
  height: 30px;
  width: 30px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: var(--color-spinner-aqua);
  background: var(--gradient-spinner-aqua);
  animation: spin 0.8s linear 0s infinite;
`;

type SpinnerCoreProps = {
  bgCoreColor: string;
};

const SpinnerCore = styled.div<SpinnerCoreProps>`
  width: 90%;
  height: 90%;
  background-color: ${p => p.bgCoreColor};
  border-radius: 50%;
`;

type LoaderProps = {
  bgColor?: string;
};
const Loader = ({ bgColor }: LoaderProps) => {
  return (
    <SpinnerRoot>
      <SpinnerCore bgCoreColor={bgColor} />
    </SpinnerRoot>
  );
};

Loader.defaultProps = {
  bgColor: 'var(--color-black)',
};
export default Loader;
