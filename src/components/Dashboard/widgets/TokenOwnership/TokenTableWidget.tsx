import React from 'react';

import styled from '@emotion/styled';

import { WidgetContainer, WidgetTitle } from '../common';

const TokenTableWidgetRoot = styled(WidgetContainer)`
  grid-column: span 2;
  grid-row: span 2;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

type TokenTableWidgetProps = {
  title: string;
  data: Array<Record<string, unknown>>;
};

const TokenTableWidget = ({ title, data }: TokenTableWidgetProps) => {
  console.log(data);
  return (
    <TokenTableWidgetRoot>
      <WidgetTitle bottomBorder>{title}</WidgetTitle>
      <Content>No data</Content>
    </TokenTableWidgetRoot>
  );
};

export default TokenTableWidget;
