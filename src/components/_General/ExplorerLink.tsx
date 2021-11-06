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

const TxId = styled.a`
  color: ${V.color.cornflower};
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
  type,
  postfix = '',
}: {
  txid: string;
  type: string;
  postfix?: string;
}) => {
  return (
    <ExplorerLinkRoot>
      <TxId>{txid}</TxId>
      <TxButtons>
        <CopyToClipboard textToCopy={txid} color={Colors.WHITE} />
        <OpenInExplorer link={`${links.explorers[TICKER]}/${type || 'tx'}/${txid}/${postfix}`} />
      </TxButtons>
    </ExplorerLinkRoot>
  );
};

export default ExplorerLink;
