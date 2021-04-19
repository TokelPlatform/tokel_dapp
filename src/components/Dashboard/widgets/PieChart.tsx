import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import { dashboardPanels } from 'vars/styles/styles';

import { WidgetContainer, WidgetTitle } from './common';

const PieChartRoot = styled(WidgetContainer)`
  grid-column: span 2;
  ${dashboardPanels}
`;

const PieChart = (): ReactElement => {
  return (
    <PieChartRoot>
      <WidgetTitle>Ooooh PIE!</WidgetTitle>
    </PieChartRoot>
  );
};

export default PieChart;
