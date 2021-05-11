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
  background: rgb(63, 249, 220);
  background: linear-gradient(0deg, rgba(63, 249, 220, 0.1) 33%, rgba(63, 249, 220, 1) 100%);
  animation: spin 0.8s linear 0s infinite;
`;

const SpinnerCore = styled.div`
  width: 90%;
  height: 90%;
  background-color: #1d2630;
  border-radius: 50%;
`;

export default function Loader() {
  return (
    <SpinnerRoot>
      <SpinnerCore />
    </SpinnerRoot>
  );
}
