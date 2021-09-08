import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';

import { selectNspvStatus } from 'store/selectors';
import { V } from 'util/theming';

const NspvIndicatorRoot = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 0 2rem;
`;

const StatusIcon = styled.div`
  height: 12px;
  width: 12px;
  border-radius: 100%;
  background-color: ${V.color.slate};
`;

const StatusText = styled.span`
  margin-left: 0.35rem;
  font-size: ${V.font.p};
  color: ${V.color.slate};
`;

const NspvIndicator = () => {
  const nspvStatus = useSelector(selectNspvStatus);
  return (
    <NspvIndicatorRoot onClick={() => ipcRenderer.send('toggle-nspv')}>
      <StatusIcon style={{ backgroundColor: nspvStatus ? V.color.growth : V.color.danger }} />
      <StatusText>nspv</StatusText>
    </NspvIndicatorRoot>
  );
};

export default NspvIndicator;
