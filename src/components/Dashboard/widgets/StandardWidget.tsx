import React from 'react';

import styled from '@emotion/styled';

import { WidgetContainer, WidgetTitle } from './common';

type StandardWidgetRootProps = {
  height: number;
  width: number;
};

const StandardWidgetRoot = styled(WidgetContainer)<StandardWidgetRootProps>`
  grid-column: span ${({ width }) => width ?? 2};
  grid-row: span ${({ height }) => height ?? 2};
  display: flex;
  flex-direction: column;
`;

type StandardWidgetProps = {
  title: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
};

const StandardWidget = ({ title, children, width, height }: StandardWidgetProps) => {
  return (
    <StandardWidgetRoot width={width} height={height}>
      <WidgetTitle bottomBorder>{title}</WidgetTitle>
      {children}
    </StandardWidgetRoot>
  );
};

export default StandardWidget;
