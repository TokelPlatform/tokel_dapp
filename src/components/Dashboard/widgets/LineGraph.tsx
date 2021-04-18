import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import { WidgetContainer, WidgetTitle } from './common';

const LineGraphRoot = styled(WidgetContainer)`
  grid-column: span 5;
`;

const LineGraph = (): ReactElement => {
  return (
    <LineGraphRoot>
      <WidgetTitle>WOW A LINE GRAPH OF ALL YOUR MONEY</WidgetTitle>
    </LineGraphRoot>
  );
};

export default LineGraph;
