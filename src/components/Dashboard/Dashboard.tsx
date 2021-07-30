import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectAccountAddress, selectKey } from 'store/selectors';
import { listTransactions, login } from 'util/nspvlib';
import { getAllTransactionDetails } from 'util/transactions';

import AssetView from './AssetView';
import Portfolio from './Portfolio/Portfolio';

const DashboardRoot = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex: 1;
  background-color: var(--color-black);
  padding: 18px;
  margin: 0;
`;

const HALFMINUTE = 30000;
const ELEVENMINUTES = 660000;

const Dashboard = (): ReactElement => {
  const key = useSelector(selectKey);
  const address = useSelector(selectAccountAddress);
  useEffect(() => {
    const loginInterval = setInterval(() => login(key), ELEVENMINUTES);
    const txInterval = setInterval(() => {
      // @todo get txs after a certain block in the future
      listTransactions(address)
        .then(txs => getAllTransactionDetails(txs.txids))
        .then(txs => dispatch.account.SET_TXS(txs))
        .catch(e => console.log(e));
    }, HALFMINUTE);
    return () => {
      clearInterval(loginInterval);
      clearInterval(txInterval);
    };
  }, [address, key]);

  return (
    <DashboardRoot>
      <Portfolio />
      <AssetView />
    </DashboardRoot>
  );
};

export default Dashboard;
