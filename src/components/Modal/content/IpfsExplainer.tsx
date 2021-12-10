import React from 'react';
import styled from '@emotion/styled';
import { V } from 'util/theming';

import { DEFAULT_NULL_MODAL } from 'store/models/environment';
import { Button } from 'components/_General/buttons';
import { Columns, Column } from 'components/_General/Grid';
import { dispatch } from 'store/rematch';
import { HIDE_IPFS_EXPLAINER_KEY } from 'vars/defines';

const Header = styled.h1`
  color: ${V.color.cornflower};

  &:first-of-type {
    margin-top: 0;
  }
`;

const LinkExample = styled.span`
  background-color: ${V.color.lilac};
  font-family: monospace;
  padding: 6px;
  border-radius: 4px;
`;

const handleCloseModal = () => dispatch.environment.SET_MODAL(DEFAULT_NULL_MODAL);

const handleDoNotRemindMe = () => {
  handleCloseModal();
  localStorage.setItem(HIDE_IPFS_EXPLAINER_KEY, 'true');
};

const IpfsExplainer: React.FC = () => (
  <div>
    <Header>WARNING</Header>
    <p>
      This is a friendly notice to remind you to think about the long-term storage of your token
      media.
    </p>
    <p>
      If you add a link here to a centralized website or server, and this link breaks in the future,
      your token or NFT <b>will point to nothing</b>.
    </p>
    <Header>WHAT TO DO</Header>
    <p>
      We recommend using IPFS for long-term storage of files. You can add an IPFS hash in this field
      in the following way:
    </p>
    <p>
      <LinkExample>ipfs://[file hash]</LinkExample>
    </p>
    <p>
      Make sure to NOT point this field to any specific IPFS gateways you do not operate, as they
      might not exist in the future either.
    </p>
    <p>
      If you need help with IPFS, please refer to the{' '}
      <a target="_blank" rel="noreferrer" href="https://docs.ipfs.io/concepts/what-is-ipfs">
        official IPFS docs
      </a>
      .
    </p>

    <Columns>
      <Column>
        <Button theme="grey" customWidth="180px" onClick={handleDoNotRemindMe}>
          Don&apos;t remind me again
        </Button>
      </Column>
      <Column>
        <Button theme="purple" customWidth="180px" onClick={handleCloseModal}>
          I understand
        </Button>
      </Column>
    </Columns>
  </div>
);

export default IpfsExplainer;
