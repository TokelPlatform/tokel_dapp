import React from 'react';
import { useSelector } from 'react-redux';

import { Global } from '@emotion/react';
import styled from '@emotion/styled';

import { Platform, usePlatform } from 'hooks/platform';
import { selectAccountReady } from 'store/selectors';
import { scrollbarStyle } from 'vars/styles/platformSpecific';

import Home from 'components/Home/Home';
import Login from 'components/Login/Login';
import TopBar from './TopBar';

const AppRoot = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

export default function App() {
  const accountReady = useSelector(selectAccountReady);

  const isWindowsOrLinux = [Platform.WINDOWS, Platform.LINUX].includes(usePlatform());

  return (
    <AppRoot>
      {isWindowsOrLinux && <Global styles={[scrollbarStyle]} />}
      <TopBar />
      {accountReady ? <Home /> : <Login />}
    </AppRoot>
  );
}
