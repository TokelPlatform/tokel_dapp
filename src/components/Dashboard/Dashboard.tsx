import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import SideMenu from './Menu/SideMenu';
import TopBar from './TopBar';
import Portfolio from './Portoflio';
import PortfolioValueGraph from './PortfolioValueGraph';
import RecentActivity from './RecentActivity';
import AssetsGraph from './AssetsGraph';

const Container = styled.div`
  background-color: var(--color-black);
  margin: 0;
  width: 1240px;
  height: 720px;
`;

const Dashboard = (): ReactElement => {
  return (
    <Container>
      <SideMenu />
      <TopBar />
      <Portfolio />
      <PortfolioValueGraph />
      <RecentActivity />
      <AssetsGraph />
    </Container>
  );
};

export default Dashboard;
