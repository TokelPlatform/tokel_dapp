/* eslint-disable no-nested-ternary */

import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { ProgressInfo } from 'builder-util-runtime';
import { ipcRenderer } from 'electron';

import { ButtonSmall } from 'components/_General/buttons';

interface UpdateInfo {
  checking: boolean;
  available: boolean;
  progress?: ProgressInfo;
  downloaded: boolean;
  error: boolean;
}

const restartApp = () => ipcRenderer.send('update-restart');

const UpdateText = styled.span`
  padding: 10px;
`;

const Updater = () => {
  const [update, setUpdate] = useState<UpdateInfo>({
    checking: false,
    available: false,
    progress: undefined,
    downloaded: false,
    error: false,
  });

  const checkForUpdate = () => {
    setUpdate(u => ({ ...u, error: false, checking: true }));
    ipcRenderer.send('update-check');
  };

  useEffect(checkForUpdate, []);

  useEffect(() => {
    ipcRenderer.on('update-error', payload => {
      console.log(payload);
      setUpdate(u => ({ ...u, checking: false, error: true }));
    });
    ipcRenderer.on('update-not-available', payload => {
      console.log(payload);
      setUpdate(u => ({ ...u, checking: false, error: false, available: false }));
    });
    ipcRenderer.on('update-available', () =>
      setUpdate(u => ({ ...u, checking: false, error: false, available: true }))
    );
    ipcRenderer.on('download-progress', (_, payload) =>
      setUpdate(u => ({ ...u, checking: false, error: false, progress: payload }))
    );
    ipcRenderer.on('update-downloaded', () =>
      setUpdate(u => ({ ...u, checking: false, error: false, downloaded: true }))
    );
    // deregister listeners
    return () => {
      ipcRenderer.removeAllListeners('update-error');
      ipcRenderer.removeAllListeners('update-not-available');
      ipcRenderer.removeAllListeners('update-available');
      ipcRenderer.removeAllListeners('download-progress');
      ipcRenderer.removeAllListeners('update-downloaded');
    };
  });

  return (
    <div>
      {update.downloaded ? (
        <ButtonSmall onClick={restartApp}>Click to restart</ButtonSmall>
      ) : update.available ? (
        <ButtonSmall onClick={() => console.log('lol')}>Click to download</ButtonSmall>
      ) : (
        <ButtonSmall onClick={checkForUpdate}>check for update</ButtonSmall>
      )}
      <UpdateText>
        {update.checking ? (
          'Checking for update...'
        ) : update.error ? (
          'An unknown error occurred'
        ) : update.progress ? (
          <>Downloading... ({Math.round(update.progress.percent)}%)</>
        ) : update.downloaded ? (
          'Downloaded successfully'
        ) : update.available ? (
          'Update available, download now'
        ) : (
          'No update available'
        )}
      </UpdateText>
    </div>
  );
};

export default Updater;
