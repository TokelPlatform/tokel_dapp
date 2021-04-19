import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import { dashboardPanels } from 'vars/styles/styles';

import { WidgetContainer, WidgetTitle } from './common';

const LineGraphRoot = styled(WidgetContainer)`
  grid-column: span 5;
  ${dashboardPanels}
`;

const LineGraph = (): ReactElement => {
  return (
    <LineGraphRoot>
      <WidgetTitle>WOW A LINE GRAPH OF ALL YOUR MONEY</WidgetTitle>
    </LineGraphRoot>
  );
};

export default LineGraph;
