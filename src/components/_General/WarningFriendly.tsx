import React from 'react';

import styled from '@emotion/styled';

import warning from 'assets/friendlyWarning.svg';

const FriendlyWarningRoot = styled.div`
  display: flex;
  flex-direction: row;
  padding: 6px 16px;
  background-color: var(--color-lighterBlack);
  border-radius: 4px;
  img {
    margin-right: 8px;
  }
`;

type FriendlyWarningProps = {
  message: string;
};

const FriendlyWarning = ({ message }: FriendlyWarningProps) => {
  return (
    <FriendlyWarningRoot>
      <img alt="warn" src={warning} />
      <p>{message}</p>
    </FriendlyWarningRoot>
  );
};

export default FriendlyWarning;
