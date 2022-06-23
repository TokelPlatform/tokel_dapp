import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import QRCode from 'qrcode.react';

import { selectAccountAddress, selectAccountPubKey, selectModalOptions } from 'store/selectors';
import { Colors, ResourceType, TICKER } from 'vars/defines';

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

const AddressWrapper = styled.p`
  text-align: center;
  width: 100%;
  overflow-x: auto;
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

export type ReceiveModalOpts = {
  type: ResourceType;
};

const Receive = () => {
  const options = useSelector(selectModalOptions) as ReceiveModalOpts;
  const target = useSelector(
    options.type === ResourceType.TOKEL ? selectAccountAddress : selectAccountPubKey
  );

  return (
    <ReceiveRoot>
      <QRCodeWrapper>
        <QRCode value={target} />
      </QRCodeWrapper>
      <VSpaceBig />
      <AddressInput>
        <AddressWrapper>{target}</AddressWrapper>
        <Copy>
          <CopyToClipboard color={Colors.WHITE} textToCopy={target} />
        </Copy>
      </AddressInput>
      <FriendlyWarning
        message={
          options.type === ResourceType.TOKEL
            ? `You can send both tokens and ${TICKER} to this address.`
            : 'Make sure to only send tokens to this pubkey'
        }
      />
    </ReceiveRoot>
  );
};

export default Receive;
