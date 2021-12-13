import React from 'react';

import styled from '@emotion/styled';

import { DEFAULT_NULL_MODAL } from 'store/models/environment';
import { dispatch } from 'store/rematch';
import { V } from 'util/theming';
import { HIDE_IPFS_EXPLAINER_KEY } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import { Column, Columns } from 'components/_General/Grid';

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
    <p>This is a friendly reminder to think about the long-term storage of your token media.</p>
    <p>
      If you add a link here to a centralized website or server, and this link breaks in the future,
      your token or NFT <b>will point to nothing</b>.
    </p>
    <Header>WHAT TO DO</Header>
    <p>
      We recommend using IPFS for long-term storage of files. You can then use an IPFS hash here
      like this:
    </p>
    <p>
      <LinkExample>ipfs://[file hash]</LinkExample>
    </p>
    <p>
      Make sure to NOT point this field at an IPFS <b>gateway</b> you do not operate, as they suffer
      from the same issue as any other centralized service. Instead use an IPFS hash directly as
      shown above.
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
