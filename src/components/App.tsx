import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { selectAccountAddress } from 'store/selectors';

import Home from 'components/Home/Home';
import Login from 'components/Login/Login';

const AppRoot = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

export default function App() {
  const address = useSelector(selectAccountAddress);

  return <AppRoot>{address ? <Home /> : <Login />}</AppRoot>;
}
