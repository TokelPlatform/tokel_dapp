import React, { ReactElement } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectAssets } from 'store/selectors';
import { randomColor } from 'util/helpers';
import { Config } from 'vars/defines';

import { WidgetContainer } from './common';

const PieChartRoot = styled(WidgetContainer)`
  grid-column: span 2;
  padding: 12px;
`;

const CustomPieChart = styled(PieChart)`
  position: relative;
  z-index: 1;
  .desc {
    font-size: 0.6rem;
    fill: var(--color-white);
  }
  .small {
    fill: var(--color-gray);
    font-size: var(--font-size-tinytiny-p);
  }
`;
const PieChartWidget = (): ReactElement => {
  const assets = useSelector(selectAssets);
  const totalValue = assets.reduce(
    (total, { balance, usd_value }) => total + balance * usd_value,
    0
  );
  const data = assets.map(a => {
    return {
      title: a.name,
      value: Math.ceil((a.balance * a.usd_value * 100) / totalValue),
      color: randomColor(),
    };
  });
  return (
    <PieChartRoot>
      <CustomPieChart lineWidth={20} radius={45} data={data}>
        <text className="desc small" x="50" y="43" dominantBaseline="central" textAnchor="middle">
          {data.length} assets{' '}
        </text>
        <text className="desc" x="50" y="55" dominantBaseline="central" textAnchor="middle">
          ${totalValue.toFixed(Config.DECIMAL)}
        </text>
      </CustomPieChart>
    </PieChartRoot>
  );
};

export default PieChartWidget;
