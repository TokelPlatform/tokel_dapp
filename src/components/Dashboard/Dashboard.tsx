import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectAccountAddress, selectKey } from 'store/selectors';
import { listTransactions, login } from 'util/nspvlib';

import AssetView from './AssetView';
import Portfolio from './Portfolio/Portfolio';

const DashboardRoot = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex: 1;
  background-color: var(--color-black);
  padding: 20px;
  margin: 0;
`;

const TX_FETCH_INTERVAL_MS = 30 * 1000;
const LOGIN_INTERVAL_MS = 11 * 60 * 1000;

const Dashboard = (): ReactElement => {
  const key = useSelector(selectKey);
  const address = useSelector(selectAccountAddress);
  useEffect(() => {
    const loginInterval = setInterval(() => login(key), LOGIN_INTERVAL_MS);
    const txInterval = setInterval(() => {
      // @todo get txs after a certain block in the future
      listTransactions(address)
        .then(txs => dispatch.account.SET_TXS(txs.txids))
        .catch(e => console.log(e));
    }, TX_FETCH_INTERVAL_MS);
    return () => {
      clearInterval(loginInterval);
      clearInterval(txInterval);
    };
  }, [key, address]);

  return (
    <DashboardRoot>
      <Portfolio />
      <AssetView />
    </DashboardRoot>
  );
};

export default Dashboard;
