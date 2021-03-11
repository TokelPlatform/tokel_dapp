import React, { ReactElement } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  position: absolute;
  background-color: var(--color-almostBlack);
  left: 416px;
  top: 366px;
  height: 312px;
  width: 464px;
`;

const RecentActivity = (): ReactElement => {
  return <Container />;
};

export default RecentActivity;
