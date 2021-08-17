import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';

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
  const [online, setOnline] = useState(true);

  useEffect(() => {
    ipcRenderer.on('nspv-status', (_, payload) => {
      setOnline(payload);
    });
    return () => {
      ipcRenderer.removeAllListeners('nspv-status');
    };
  }, []);

  return (
    <NspvIndicatorRoot onClick={() => ipcRenderer.send('toggle-nspv')}>
      <StatusIcon style={{ backgroundColor: online ? V.color.growth : V.color.danger }} />
      <StatusText>nspv</StatusText>
    </NspvIndicatorRoot>
  );
};

export default NspvIndicator;
