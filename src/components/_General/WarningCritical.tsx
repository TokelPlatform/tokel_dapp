import React, { ReactChild } from 'react';

import styled from '@emotion/styled';

import warning from 'assets/warningIcon.svg';

const WarningRoot = styled.div`
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
  margin-bottom: 2rem;
`;

type WarningProps = {
  title: string;
  subtitle: Array<string | ReactChild>;
};

const Warning = ({ title, subtitle }: WarningProps) => {
  return (
    <WarningRoot>
      <img alt="warning" src={warning} />
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </WarningRoot>
  );
};

export default Warning;
