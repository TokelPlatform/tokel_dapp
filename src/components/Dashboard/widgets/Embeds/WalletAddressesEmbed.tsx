import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectAccountAddress, selectAccountPubKey, selectCurrentTokenInfo } from 'store/selectors';
import { ModalName, ResourceType } from 'vars/defines';

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
        Currently TOKEL has different address for tokens and TKL, however we are working on changing
        that to one unified address. Stay tuned.
      </Note>
      <DisplayWalletAddress title="TKL address" modal_type="acc_address" />
      <DisplayWalletAddress title="Tokens and NFTS (pubkey)" modal_type="pub_key" />
    </WalletAddressesEmbedRoot>
  );
};

export default WalletAddressesEmbed;
