import React from 'react';

import styled from '@emotion/styled';

const ProgressBarRoot = styled.div`
  display: flex;
  background-color: 10px;
  width: 100%;
  height: 20px;
  align-items: center;
`;

const Bar = styled.div`
  border-radius: var(--border-radius-big);
  height: 10px;
  flex: 1;
  overflow: hidden;
  background-color: var(--color-black);
`;

const BarFill = styled.div`
  background-color: var(--color-lightpurple);
  height: 100%;
`;

const Label = styled.span`
  padding-left: 8px;
`;

type ProgressBarProps = {
  percentage: number;
};

const ProgressBar = ({ percentage }: ProgressBarProps) => (
  <ProgressBarRoot>
    <Bar>
      <BarFill style={{ width: `${percentage}%` }} />
    </Bar>
    <Label>{percentage}%</Label>
  </ProgressBarRoot>
);

export default ProgressBar;
