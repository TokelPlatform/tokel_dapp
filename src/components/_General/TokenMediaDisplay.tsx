import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ipcRenderer } from 'electron';
import styled from '@emotion/styled';

import { Responsive } from 'util/helpers';
import { V } from 'util/theming';
import { IPFS_IPC_ID, IpfsAction, checkIsIPFSLink } from 'vars/defines';

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

const TokenMediaIframe = styled.iframe`
  width: 100%;
  border: 0;
`;

interface TokenMediaDisplayProps {
  url?: string;
}

const TokenMediaDisplay: React.FC<TokenMediaDisplayProps> = ({ url }) => {
  const iframeRef = useRef<HTMLIFrameElement>();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeHeight, setIframeHeight] = useState<number | 'unset'>('unset');
  const [mediaUrl, setMediaUrl] = useState(null);

  const isIpfs = useMemo(() => checkIsIPFSLink(url), [url]);

  useEffect(() => {
    if (!url) {
      setIframeLoaded(false);
      setIframeHeight('unset');
      setMediaUrl(null);
    }
  }, [url]);

  // Request IPFS file if it's an IPFS link. Set link meanwhile anyway
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

  // Listen for IPFS files
  useEffect(() => {
    const listener = (_, data) => {
      if (data.type === IpfsAction.GET && isIpfs) {
        setMediaUrl(data.payload.filedata);
      }
    };

    ipcRenderer.on(IPFS_IPC_ID, listener);

    return () => {
      ipcRenderer.removeListener(IPFS_IPC_ID, listener);
    };
  }, [isIpfs]);

  // Post media to iframe, along with actual iframe width
  useEffect(() => {
    if (iframeLoaded) {
      iframeRef.current?.contentWindow.postMessage(
        { mediaUrl, width: iframeRef?.current.offsetWidth },
        '*'
      );
    }
  }, [mediaUrl, iframeRef, iframeLoaded]);

  // Adjust iframe height based on content height
  useEffect(() => {
    let observer;
    const targetElement = iframeRef?.current?.contentWindow.document.getElementById('mediaWrapper');

    if (targetElement) {
      observer = new ResizeObserver(() => {
        setIframeHeight(iframeRef?.current?.contentWindow.document.body.scrollHeight);
      });

      observer.observe(targetElement);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [iframeRef, iframeLoaded]);

  if (!mediaUrl) return null;

  return (
    <MediaContent>
      <ImageFrame>
        <TokenMediaIframe
          height={iframeHeight}
          ref={iframeRef}
          src={`file://${__dirname}/externalMedia.html`}
          onLoad={() => setIframeLoaded(true)}
        />
      </ImageFrame>
    </MediaContent>
  );
};

export default TokenMediaDisplay;
