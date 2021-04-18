import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import { WidgetContainer, WidgetTitle } from './common';

const PieChartRoot = styled(WidgetContainer)`
  grid-column: span 2;
`;

const PieChart = (): ReactElement => {
  return (
    <PieChartRoot>
      <WidgetTitle>Ooooh PIE!</WidgetTitle>
    </PieChartRoot>
  );
};

export default PieChart;
