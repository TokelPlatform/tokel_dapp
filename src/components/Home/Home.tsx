import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectModal, selectView } from 'store/selectors';
import { ViewType } from 'vars/defines';

import Dashboard from 'components/Dashboard/Dashboard';
import modals from 'components/Modal/content';
import Modal from 'components/Modal/Modal';
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

const renderView = viewType => {
  switch (viewType) {
    case ViewType.DASHBOARD:
      return <Dashboard />;
    default:
      return <div>{viewType} not implemented</div>;
  }
};

const Home = () => {
  const currentView = useSelector(selectView);
  const modalProps = modals[useSelector(selectModal)];

  return (
    <HomeRoot>
      <TopBar />
      <HorzContainer>
        <SideMenu />
        <ViewWrapper>{renderView(currentView)}</ViewWrapper>
      </HorzContainer>
      {modalProps && <Modal title={modalProps.title}>{modalProps.children}</Modal>}
    </HomeRoot>
  );
};

export default Home;
