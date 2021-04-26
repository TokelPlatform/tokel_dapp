import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import QRCode from 'qrcode.react';

import warning from 'assets/friendlyWarning.svg';
import { selectAccountAddress, selectChosenAsset } from 'store/selectors';

import CopyToClipboard from 'components/_General/CopyToClipboard';

const ReceiveRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const QRCodeWrapper = styled.div`
  background-color: var(--color-white);
  padding: 12px;
  width: 150px;
  height: 150px;
`;
const AddressInput = styled.div`
  margin-top: 32px;
  height: 36px;
  width: 360px;
  border: 1px solid var(--color-lighterBlack);
  box-sizing: border-box;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Warning = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 32px;
  padding: 6px 16px;
  background-color: var(--color-lighterBlack);
  border-radius: 4px;
  img {
    margin-right: 8px;
  }
`;

const Copy = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  border-left: 1px solid var(--color-lighterBlack);
  margin-left: 16px;
  padding-left: 12px;
`;

const Receive = () => {
  const address = useSelector(selectAccountAddress);
  const chosenAsset = useSelector(selectChosenAsset);
  return (
    <ReceiveRoot>
      <QRCodeWrapper>
        <QRCode value={address} />
      </QRCodeWrapper>
      <AddressInput>
        {address}
        <Copy>
          <CopyToClipboard color="white" textToCopy={address} />
        </Copy>
      </AddressInput>
      <Warning>
        <img alt="warn" src={warning} />
        <p>Make sure to send only {chosenAsset} to this address.</p>
      </Warning>
    </ReceiveRoot>
  );
};

export default Receive;
