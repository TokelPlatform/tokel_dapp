import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectView } from 'store/selectors';
import { ViewType } from 'vars/defines';

import InfoNote from 'components/_General/InfoNote';
import Dashboard from 'components/Dashboard/Dashboard';
import SideMenu from './Menu/SideMenu';
import TopBar from './TopBar';

const HomeRoot = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const HorzContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  flex: 1;
`;

const ViewWrapper = styled.div`
  flex: 1;
  height: 100%;
  padding: 20px;
  overflow: scroll;
`;

const getNote = name => (
  <InfoNote
    title={name.concat(' functionality is not available currently')}
    subtitle={[
      'Please have a look at our ',
      <a key="tokellink" href="https://tokel.io">
        roadmap
      </a>,
      ' or reach out to us in ',
      <a key="discordLink" href="https://discord.gg/MHxJZVFkqa">
        Discord
      </a>,
    ]}
  />
);
const renderView = viewType => {
  switch (viewType) {
    case ViewType.DASHBOARD:
      return <Dashboard />;
    case ViewType.DEX:
      return getNote('Decentralized Exchange');
    case ViewType.NFT_MARKET:
      return getNote('NFT Marketplace');
    case ViewType.SETTINGS:
      return getNote('Setting');
    default:
      return getNote('This functionality');
  }
};

const Home = () => {
  const currentView = useSelector(selectView);

  return (
    <HomeRoot>
      <TopBar />
      <HorzContainer>
        <SideMenu />
        <ViewWrapper>{renderView(currentView)}</ViewWrapper>
      </HorzContainer>
    </HomeRoot>
  );
};

export default Home;
