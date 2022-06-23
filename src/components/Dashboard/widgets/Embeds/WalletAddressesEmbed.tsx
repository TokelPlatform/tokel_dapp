import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectAccountAddress, selectAccountPubKey, selectCurrentTokenInfo } from 'store/selectors';
import { ModalName, ResourceType, TICKER } from 'vars/defines';

import CopyTextInput from 'components/_General/CopyTextInput';
import { ReceiveModalOpts } from 'components/Modal/content/Receive';
import { ColWrapper, EmbedContentContainer, RowWrapper } from '../common';

const WalletAddressesEmbedRoot = styled(EmbedContentContainer)`
  padding: 20px 30px 20px 30px;
`;

const Note = styled.p`
  font-size: var(--font-size-small-p);
  color: var(--color-slate);
  font-weight: 400;
  margin-bottom: 0;
  margin-top: 4px;
`;

type WalletAddressWidgetProps = {
  title: string;
  modal_type: string;
};

const openWalletModal = (options: ReceiveModalOpts) => () =>
  dispatch.environment.SET_MODAL({ name: ModalName.RECEIVE, options });

const DisplayWalletAddress = ({ title, modal_type }: WalletAddressWidgetProps) => {
  const tokenInfo = useSelector(selectCurrentTokenInfo);
  const isNFT = tokenInfo?.supply === 1;
  const target = useSelector(
    modal_type === 'acc_address' ? selectAccountAddress : selectAccountPubKey
  );

  return (
    <RowWrapper>
      <ColWrapper>
        <CopyTextInput
          textToCopy={target}
          label={title}
          onClick={openWalletModal({
            type:
              modal_type === 'pub_key'
                ? isNFT
                  ? ResourceType.NFT
                  : ResourceType.FST
                : ResourceType.TOKEL,
          })}
        />
      </ColWrapper>
    </RowWrapper>
  );
};

const WalletAddressesEmbed = () => {
  return (
    <WalletAddressesEmbedRoot>
      <Note>
        You can receive {TICKER}, tokens, and NFTs in your address. You can use your public key to
        search full balances of tokens on explorers
      </Note>
      <DisplayWalletAddress title="Address" modal_type="acc_address" />
      <DisplayWalletAddress title="Public Key" modal_type="pub_key" />
    </WalletAddressesEmbedRoot>
  );
};

export default WalletAddressesEmbed;
