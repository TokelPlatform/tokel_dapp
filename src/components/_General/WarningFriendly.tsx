import React from 'react';

import styled from '@emotion/styled';

import warning from 'assets/friendlyWarning.svg';

const WarningFriendlyRoot = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 32px;
  padding: 6px 16px;
  background-color: var(--color-lighterBlack);
  border-radius: 4px;
  img {
    margin-right: 8px;
  }
`;

type WarningFriendlyProps = {
  message: string;
};

const WarningFriendly = ({ message }: WarningFriendlyProps) => {
  return (
    <WarningFriendlyRoot>
      <img alt="warn" src={warning} />
      <p>{message}</p>
    </WarningFriendlyRoot>
  );
};

export default WarningFriendly;
