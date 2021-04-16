import React from 'react';
import styled from '@emotion/styled';

type ProgressBarProps = {
  length: string;
  percentage: string;
};

type BarProps = {
  length: string;
};

const Bar = styled.div<BarProps>`
  height: 4px;
  background-color: var(--color-lightpurple);
  width: ${(p) => p.length}px;
  border-radius: 10px;
  margin: 0.25rem 0;
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  p {
    margin: 0;
    margin-left: 0.5rem;
    font-size: var(--font-size-additional-p);
  }
`;

const ProgressBar = ({ length, percentage }: ProgressBarProps) => {
  return (
    <Container>
      <Bar length={length} />
      <p>{percentage}%</p>
    </Container>
  );
};

export default ProgressBar;
