import React from 'react';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { Colors } from 'vars/defines';

import { Button } from './buttons';

const CloseModalButtonRoot = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0 1rem 0;
`;

const CloseModalButton = () => (
  <CloseModalButtonRoot>
    <Button
      customWidth="180px"
      onClick={() => dispatch.environment.SET_MODAL(null)}
      theme={Colors.TRANSPARENT}
    >
      Close
    </Button>
  </CloseModalButtonRoot>
);

export default CloseModalButton;
