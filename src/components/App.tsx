import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Global } from '@emotion/react';
import styled from '@emotion/styled';

import { Platform, usePlatform } from 'hooks/platform';
import { selectAccountReady, selectTheme } from 'store/selectors';
import { cssVarStyle } from 'util/theming';
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
  const themeName = useSelector(selectTheme);

  useEffect(() => {
    document.body.dataset.theme = themeName;
  }, [themeName]);

  const isWindowsOrLinux = [Platform.WINDOWS, Platform.LINUX].includes(usePlatform());

  return (
    <AppRoot>
      <Global styles={[cssVarStyle, isWindowsOrLinux && scrollbarStyle].filter(Boolean)} />
      <TopBar />
      {accountReady ? <Home /> : <Login />}
    </AppRoot>
  );
}
