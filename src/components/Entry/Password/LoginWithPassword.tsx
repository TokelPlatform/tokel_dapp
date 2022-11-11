import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectAccountWallets } from 'store/selectors';
import { V } from 'util/theming';

import PasswordedAccountAccordion from './PasswordedAccountAccordion';

const PasswordLoginRoot = styled.div``;

const WalletBoxLabel = styled.h3`
  text-align: right;
  text-transform: uppercase;
  font-size: ${V.font.h3};
  color: ${V.color.slate};
  margin-bottom: 0;
  margin-right: 8px;
`;

const AvailableWalletsBox = styled.div`
  border: 1px solid ${V.color.cornflower};
  border-radius: ${V.size.borderRadius};
  width: 440px;
  overflow: hidden;
`;

const PasswordLogin = () => {
  const wallets = useSelector(selectAccountWallets);

  React.useEffect(() => {
    dispatch.account.loadWallets();
  }, []);

  return (
    <PasswordLoginRoot>
      <WalletBoxLabel>wallets</WalletBoxLabel>
      <AvailableWalletsBox>
        <PasswordedAccountAccordion wallets={wallets} />
      </AvailableWalletsBox>
    </PasswordLoginRoot>
  );
};

export default PasswordLogin;
