import React, { ReactElement } from 'react';
import { PieChart } from 'react-minimal-pie-chart';

import styled from '@emotion/styled';

import { WidgetContainer } from './common';

const PieChartRoot = styled(WidgetContainer)`
  grid-column: span 2;
  padding: 12px;
`;

const CustomPieChart = styled(PieChart)`
  position: relative;
  z-index: 1;
  .desc {
    font-size: var(--font-size-tiny-p);
    fill: var(--color-white);
  }
  .small {
    fill: var(--color-gray);
    font-size: var(--font-size-tinytiny-p);
  }
`;
const PieChartWdiget = (): ReactElement => {
  return (
    <PieChartRoot>
      {/* @todo pass portfolio assets */}
      <CustomPieChart
        lineWidth={20}
        radius={45}
        data={[
          { title: 'One', value: 70, color: '#423A76' },
          { title: 'Two', value: 15, color: '#3A4778' },
          { title: 'Three', value: 15, color: 'purple' },
        ]}
      >
        <text className="desc small" x="50" y="43" dominantBaseline="central" textAnchor="middle">
          2 assets{' '}
        </text>
        <text className="desc" x="50" y="55" dominantBaseline="central" textAnchor="middle">
          $9,383.54
        </text>
      </CustomPieChart>
    </PieChartRoot>
  );
};

export default PieChartWdiget;
