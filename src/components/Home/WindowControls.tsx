import React from 'react';

import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';

import { WindowControl } from 'vars/defines';

const WindowControlRoot = styled.div`
  margin-top: -5px;
  margin-left: 9px;
  width: 52px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface WindowButtonProps {
  control: string;
}

const WindowButton = styled.button<WindowButtonProps>`
  border: none;
  user-select: none;
  cursor: pointer;
  height: 12px;
  width: 12px;
  border-radius: 100px;
  background-color: var(--color-window-${p => p.control});
  &:hover {
    background-color: var(--color-window-${p => p.control}-hover);
  }
`;

const WindowControls = () => (
  <WindowControlRoot>
    {Object.values(WindowControl).map(control => (
      <WindowButton
        key={control}
        control={control}
        onClick={() => ipcRenderer.send('window-controls', control)}
      />
    ))}
  </WindowControlRoot>
);

export default WindowControls;
