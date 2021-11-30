import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ipcRenderer } from 'electron';
import styled from '@emotion/styled';

import { Responsive, getContentType } from 'util/helpers';
import { V } from 'util/theming';
import { IPFS_IPC_ID, IpfsAction, checkIsIPFSLink, HTTP_ERR_405 } from 'vars/defines';

import Loader from 'components/_General/Spinner';

const MediaContent = styled.div`
  overflow-y: auto;
  display: flex;
  width: 100%;
  padding-left: 20px;
  justify-content: center;
  ${Responsive.below.L} {
    order: 1;
    padding-left: 0;
  }
`;

const ImageFrame = styled.div`
  border-radius: ${V.size.borderRadius};
`;

const TokenMediaImage = styled.img`
  max-width: 100%;
`;

const TokenMediaVideo = styled.video`
  max-width: 100%;
  outline: none;
`;

const TokenMediaAudio = styled.audio`
  max-width: 100%;
`;

const TokenMediaIframe = styled.iframe`
  border: 0;
`;

const LoaderContainer = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${V.color.backSoftest};
`;

interface TokenMediaDisplayProps {
  url?: string;
}

const TokenMediaDisplay: React.FC<TokenMediaDisplayProps> = ({ url }) => {
  const [contentType, setContentType] = useState<null | string | string[]>(null);
  const [mediaUrl, setMediaUrl] = useState(null);

  const loading = !mediaUrl || !contentType;
  const isIpfs = useMemo(() => checkIsIPFSLink(url), [url]);

  useEffect(() => {
    setMediaUrl(null);
    setContentType(null);

    getContentType('head', url)
      .then(type => setContentType(type))
      .catch(e => {
        if (e.message === HTTP_ERR_405) {
          // eslint-disable-next-line promise/no-nesting
          getContentType('get', url)
            .then(type => setContentType(type))
            .catch(error => console.log(error));
        } else {
          console.log(e);
        }
      });
  }, [url]);

  useEffect(() => {
    if (isIpfs) {
      ipcRenderer.send(IPFS_IPC_ID, {
        type: IpfsAction.GET,
        payload: {
          ipfsId: url?.split('/')[url?.split('/').length - 1],
        },
      });
    }

    setMediaUrl(url);
  }, [url, isIpfs]);

  useEffect(() => {
    const listener = (_, data) => {
      if (data.type === IpfsAction.GET && isIpfs) {
        setMediaUrl(data.payload.filedata);
        setContentType(data.payload.type?.mime?.split('/'));
      }
    };

    ipcRenderer.on(IPFS_IPC_ID, listener);

    return () => {
      ipcRenderer.removeListener(IPFS_IPC_ID, listener);
    };
  }, [contentType, isIpfs]);

  const MediaBlock = useCallback(() => {
    if (contentType?.includes('image')) {
      return <TokenMediaImage src={mediaUrl} title={url} alt={url} />;
    }

    if (contentType?.includes('video')) {
      return (
        <TokenMediaVideo autoPlay muted controls loop>
          <source src={mediaUrl} />
        </TokenMediaVideo>
      );
    }

    if (contentType?.includes('audio')) {
      return (
        <TokenMediaAudio controls>
          <source src={mediaUrl} />
        </TokenMediaAudio>
      );
    }

    // let chromium figure otherwise
    return <TokenMediaIframe src={mediaUrl} title={url} />;
  }, [contentType, mediaUrl, url]);

  if (!url) return null;

  return (
    <MediaContent>
      <ImageFrame>
        {loading ? (
          <LoaderContainer>
            <Loader bgColor={V.color.back} />
          </LoaderContainer>
        ) : (
          <MediaBlock />
        )}
      </ImageFrame>
    </MediaContent>
  );
};

export default TokenMediaDisplay;
