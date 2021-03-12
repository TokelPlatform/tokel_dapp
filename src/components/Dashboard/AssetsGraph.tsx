import React, { ReactElement } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  position: absolute;
  background-color: var(--color-almostBlack);
  left: 896px;
  top: 366px;
  height: 312px;
  width: 320px;
  border-radius: 4;
`;

const AssetsGraph = (): ReactElement => {
  return <Container />;
};

export default AssetsGraph;
