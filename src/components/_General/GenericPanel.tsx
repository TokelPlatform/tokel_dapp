import React from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Responsive } from 'util/helpers';
import { V } from 'util/theming';

import { WidgetContainer } from 'components/Dashboard/widgets/common';

const thinPanelStyle = css`
  width: 60%;
  ${Responsive.below.L} {
    width: 75%;
  }
  ${Responsive.below.M} {
    width: 100%;
  }
`;

const GenericPanelRoot = styled(WidgetContainer)<{ thin?: boolean }>`
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
  margin: 20px;
  ${p => p.thin && thinPanelStyle}
`;

const Header = styled.div`
  border-bottom: 1px solid ${V.color.backSoftest};
  font-size: 24px;
  padding: 32px;
  padding-left: 38px;
`;

const Content = styled.div`
  height: 100%;
  padding: 38px;
`;

type GenericPanelProps = {
  title: string;
  thin: boolean;
  children: React.ReactNode;
};

const GenericPanel = ({ title, thin, children }: GenericPanelProps) => (
  <GenericPanelRoot thin={thin}>
    <Header>{title}</Header>
    <Content>{children}</Content>
  </GenericPanelRoot>
);

export default GenericPanel;
