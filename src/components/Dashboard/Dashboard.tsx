import React, { ReactElement, useEffect, useState } from 'react';

import styled from '@emotion/styled';

import AssetsGraph from './AssetsGraph';
import SideMenu from './Menu/SideMenu';
import TopBar from './Menu/TopBar';
import PortfolioValueGraph from './PortfolioValueGraph';
import Portfolio from './Portofolio/Portfolio';
import RecentActivity from './RecentActivity';

const { ipcRenderer } = require('electron');

const Container = styled.div`
  background-color: var(--color-black);
  margin: 0;
  width: 1240px;
  height: 720px;
`;

const Dashboard = (): ReactElement => {
  const [address, setAddress] = useState(null);
  const [utxos, setUtxos] = useState(null);
  const [balance, setBalance] = useState(null);

  ipcRenderer.on('pass-login-info', (event, arg) => {
    console.log(arg, event);
    setBalance(arg.balance);
    setUtxos(arg.utxos);
    setAddress(arg.address);
  });

  useEffect(() => {}, []);
  return (
    <Container>
      <SideMenu />
      <TopBar />
      <Portfolio balance={balance} address={address} />
      <PortfolioValueGraph />
      <RecentActivity utxos={utxos} />
      <AssetsGraph />
    </Container>
  );
};

export default Dashboard;
