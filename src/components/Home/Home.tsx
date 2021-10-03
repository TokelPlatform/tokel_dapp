import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectModalName, selectView } from 'store/selectors';
import links from 'util/links';
import { TOPBAR_HEIGHT, ViewType } from 'vars/defines';

import InfoNote from 'components/_General/InfoNote';
import Dashboard from 'components/Dashboard/Dashboard';
import SideMenu from 'components/Home/Menu/SideMenu';
import modals from 'components/Modal/content';
import Modal from 'components/Modal/Modal';
import Settings from 'components/Settings/Settings';

const HomeRoot = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - ${TOPBAR_HEIGHT}px);
`;

const ViewWrapper = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  overflow: auto;
`;

const getNote = (name: string) => (
  <InfoNote
    title={`${name} functionality is not available currently`}
    subtitle={[
      'Please have a look at our ',
      <a key="tokellink" href={links.websiteRoadmap} rel="noreferrer" target="_blank">
        roadmap
      </a>,
      ' or reach out to us in ',
      <a key="discordLink" href={links.discord} rel="noreferrer" target="_blank">
        Discord
      </a>,
    ]}
  />
);

const renderView = (viewType: ViewType[keyof ViewType]) => {
  switch (viewType) {
    case ViewType.DASHBOARD:
      return <Dashboard />;
    case ViewType.DEX:
      return getNote('Decentralized Exchange');
    case ViewType.NFT_MARKET:
      return getNote('NFT Marketplace');
    case ViewType.SETTINGS:
      return <Settings />;
    default:
      return getNote('This functionality');
  }
};

const Home = () => {
  const currentView = useSelector(selectView);
  const modalProps = modals[useSelector(selectModalName)];

  return (
    <HomeRoot>
      <SideMenu />
      <ViewWrapper>{renderView(currentView)}</ViewWrapper>
      {modalProps && <Modal title={modalProps.title}>{modalProps.component}</Modal>}
    </HomeRoot>
  );
};

export default Home;
