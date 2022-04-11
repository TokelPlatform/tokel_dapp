import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectAccountAddress, selectAccountPubKey, selectCurrentTokenInfo } from 'store/selectors';
import { V } from 'util/theming';
import { Colors, ModalName, ResourceType } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import CopyToClipboard from 'components/_General/CopyToClipboard';
import { ReceiveModalOpts } from 'components/Modal/content/Receive';
import { EmbedContentContainer, RowWrapper } from '../common';

const WalletAddressesEmbedRoot = styled(EmbedContentContainer)`
  padding: 20px 30px;
`;

const WalletAddressWidgetLabel = styled.p`
  text-transform: uppercase;
  font-size: ${V.font.pSmall};
  color: ${V.color.frontSoft};
`;

const Copy = styled.div`
  padding-top: 11px;
  margin-left: 5px;
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
    <>
      <WalletAddressWidgetLabel>{title}</WalletAddressWidgetLabel>
      <RowWrapper>
        <Button
          onClick={openWalletModal({
            type:
              modal_type === 'pub_key'
                ? isNFT
                  ? ResourceType.NFT
                  : ResourceType.FST
                : ResourceType.TOKEL,
          })}
          theme="transparent"
          customWidth="120px"
        >
          Show
        </Button>
        <Copy>
          <CopyToClipboard textToCopy={target} color={Colors.WHITE} />
        </Copy>
      </RowWrapper>
    </>
  );
};

const WalletAddressesEmbed = () => {
  return (
    <WalletAddressesEmbedRoot>
      <DisplayWalletAddress title="Receive TKL" modal_type="acc_address" />
      <DisplayWalletAddress title="Receive NFTs and Tokens" modal_type="pub_key" />
    </WalletAddressesEmbedRoot>
  );
};

export default WalletAddressesEmbed;
