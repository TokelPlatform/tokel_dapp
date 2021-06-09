import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import QRCode from 'qrcode.react';

import { selectAccountAddress, selectChosenAsset } from 'store/selectors';
import { Colors } from 'vars/defines';

import CopyToClipboard from 'components/_General/CopyToClipboard';
import FriendlyWarning from 'components/_General/WarningFriendly';
import { VSpaceBig } from 'components/Dashboard/widgets/common';

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
  height: 36px;
  width: 375px;
  border: 1px solid var(--color-lighterBlack);
  box-sizing: border-box;
  border-radius: 2px;
  display: flex;
  align-items: center;
`;

const Copy = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 36px;
  border-left: 1px solid var(--color-lighterBlack);
  padding-top: 4px;
`;

const Receive = () => {
  const address = useSelector(selectAccountAddress);
  const chosenAsset = useSelector(selectChosenAsset);
  return (
    <ReceiveRoot>
      <QRCodeWrapper>
        <QRCode value={address} />
      </QRCodeWrapper>
      <VSpaceBig />
      <AddressInput>
        <p style={{ textAlign: 'center', width: '100%' }}>{address}</p>
        <Copy>
          <CopyToClipboard color={Colors.WHITE} textToCopy={address} />
        </Copy>
      </AddressInput>
      <FriendlyWarning message={`Make sure to send only ${chosenAsset} to this address.`} />
    </ReceiveRoot>
  );
};

export default Receive;
