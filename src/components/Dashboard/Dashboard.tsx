import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectKey } from 'store/selectors';
import { listTransactions, login } from 'util/nspvlib';

import AssetView from './AssetView';
import Portfolio from './Portfolio/Portfolio';

const DashboardRoot = styled.div`
  display: flex;
  height: 100%;
  background-color: var(--color-black);
  /* width: 100%; */
`;

const HALFMINUTE = 30000;
const ELEVENMINUTES = 660000;

const Dashboard = (): ReactElement => {
  const key = useSelector(selectKey);
  useEffect(() => {
    const loginInterval = setInterval(() => login(key), ELEVENMINUTES);
    const txInterval = setInterval(() => {
      listTransactions()
        .then(txs => dispatch.account.SET_TXS(txs.txids))
        .catch(e => console.log(e));
    }, HALFMINUTE);
    return () => {
      clearInterval(loginInterval);
      clearInterval(txInterval);
    };
  }, []);

  return (
    <DashboardRoot>
      <Portfolio />
      <AssetView />
    </DashboardRoot>
  );
};

export default Dashboard;
