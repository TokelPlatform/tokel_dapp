import React from 'react';

import styled from '@emotion/styled';

import warning from 'assets/warningIcon.svg';

const WarningCriticalRoot = styled.div`
  display: flex;
  flex-direction: row;
  img {
    margin-right: 0.5rem;
  }
  h3,
  p {
    margin: 0;
  }
  h3 {
    color: var(--color-white);
    font-weight: 400;
    font-size: var(--font-size-p);
  }
  p {
    color: var(--color-gray);
    font-size: var(--font-size-p);
  }
`;

type WarningCriticalProps = {
  title: string;
  subtitle: Array<string | React.ReactChild>;
};

const WarningCritical = ({ title, subtitle }: WarningCriticalProps) => {
  return (
    <WarningCriticalRoot>
      <img alt="warning" src={warning} />
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </WarningCriticalRoot>
  );
};

export default WarningCritical;
