import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import InfoNote from 'components/_General/InfoNote';
import { WidgetContainer } from './common';

const LineGraphRoot = styled(WidgetContainer)`
  grid-column: span 5;
`;

const LineGraph = (): ReactElement => {
  return (
    <LineGraphRoot>
      <InfoNote title="Graph functionality is coming  soon" />
    </LineGraphRoot>
  );
};

export default LineGraph;
