import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Global } from '@emotion/react';
import styled from '@emotion/styled';
import axios from 'axios';

import { Platform, usePlatform } from 'hooks/platform';
import { dispatch } from 'store/rematch';
import { selectAccountReady, selectShowNetworkPrefs, selectTheme } from 'store/selectors';
import { cssVarStyle } from 'util/theming';
import { TOKEL_PRICE_UPDATE_PERIOD_MS, TOKEL_PRICE_URL } from 'vars/defines';
import { scrollbarStyle } from 'vars/styles/platformSpecific';

import Home from 'components/Home/Home';
import Login from 'components/Login/Login';
import NetworkPrefs from 'components/Settings/NetworkPrefs';
import TopBar from './TopBar';

const AppRoot = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const fetchTokelPrice = async () => {
  try {
    const priceJson = await axios(TOKEL_PRICE_URL);
    dispatch.environment.SET_TOKEL_PRICE_USD(priceJson.data[0]?.price);
  } catch (e) {
    console.log(e);
  }
};

export default function App() {
  const accountReady = useSelector(selectAccountReady);
  const themeName = useSelector(selectTheme);
  const showNetworkPrefs = useSelector(selectShowNetworkPrefs);

  useEffect(() => {
    document.body.dataset.theme = themeName;
  }, [themeName]);

  useEffect(() => {
    fetchTokelPrice();
    const priceClock = setInterval(fetchTokelPrice, TOKEL_PRICE_UPDATE_PERIOD_MS);
    return () => {
      clearInterval(priceClock);
    };
  }, []);

  const isWindowsOrLinux = [Platform.WINDOWS, Platform.LINUX].includes(usePlatform());

  return (
    <AppRoot>
      <Global styles={[cssVarStyle, isWindowsOrLinux && scrollbarStyle].filter(Boolean)} />
      <TopBar />
      {accountReady ? <Home /> : <Login />}
      {showNetworkPrefs && <NetworkPrefs />}
    </AppRoot>
  );
}
