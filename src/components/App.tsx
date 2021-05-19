import React from 'react';
import { useSelector } from 'react-redux';

import { Global } from '@emotion/react';
import styled from '@emotion/styled';

import {
  selectAccountAddress,
  selectAssets,
  selectTransactions,
  selectUnspent,
} from 'store/selectors';
import { Platform, usePlatform } from 'hooks/platform';
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
  const address = useSelector(selectAccountAddress);
  const unspent = useSelector(selectUnspent);
  const txs = useSelector(selectTransactions);
  const assets = useSelector(selectAssets);

  const isWindowsOrLinux = [Platform.WINDOWS, Platform.LINUX].includes(usePlatform());

  return (
    <AppRoot>
      {isWindowsOrLinux && <Global styles={[scrollbarStyle]} />}
      <TopBar bgColor={address ? undefined : 'var(--color-black)'} />
      {address && txs && unspent && assets.length > 0 ? <Home /> : <Login />}
    </AppRoot>
  );
}
