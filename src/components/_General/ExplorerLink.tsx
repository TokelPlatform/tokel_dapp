import React from 'react';

import styled from '@emotion/styled';

import links from 'util/links';
import { V } from 'util/theming';
import { Colors, TICKER } from 'vars/defines';

import CopyToClipboard from './CopyToClipboard';
import OpenInExplorer from './OpenInExplorer';

const ExplorerLinkRoot = styled.div`
  display: flex;
`;

type TxIdProps = {
  txidColor: string;
};

const TxId = styled.a<TxIdProps>`
  color: ${p => p.txidColor || V.color.cornflower};
  margin-right: 12px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  &:hover {
    color: ${V.color.cornflower};
  }
`;

const TxButtons = styled.div`
  display: flex;
  align-items: center;
  min-width: 80px;
`;

const ExplorerLink = ({
  txid,
  txidColor,
  type = 'tx',
  postfix = '',
}: {
  txid: string;
  txidColor?: string;
  type?: string;
  postfix?: string;
}) => {
  const link = links.explorers[TICKER](`${type}/${txid}${postfix ? `/${postfix}` : ''}`);

  return (
    <ExplorerLinkRoot>
      <TxId txidColor={txidColor}>{txid}</TxId>
      <TxButtons>
        <CopyToClipboard textToCopy={txid} color={Colors.WHITE} />
        <OpenInExplorer link={link} />
      </TxButtons>
    </ExplorerLinkRoot>
  );
};

export default ExplorerLink;
