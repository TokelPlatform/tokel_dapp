import React from 'react';

import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';

import { Responsive, extractIPFSHash } from 'util/helpers';
import { V } from 'util/theming';
import {
  DEFAULT_IPFS_FALLBACK_GATEWAY,
  DisclaimerTextContent,
  IPFS_IPC_ID,
  IpfsAction,
  TOKEN_WHITE_LIST_LOCATION,
} from 'vars/defines';

import { ButtonSmall } from 'components/_General/buttons';

const MediaContent = styled.div`
  overflow-y: auto;
  display: flex;
  width: 100%;
  height: 100%;
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
  height: 100%;
  border: 0;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

const DisclaimerText = styled.div`
  text-align: left;
  font-size: var(--font-size-additional-p);
  opacity: 0.8;
  padding: 0 16px;
`;

interface TokenMediaDisplayProps {
  url?: string;
}

const DisclaimerHeader = styled.h4`
  text-align: left;
  padding: 0px 0 0 16px;
  opacity: 0.8;
  margin-bottom: 8px;
  margin-top: 16px;
`;

const TokenMediaDisplay: React.FC<TokenMediaDisplayProps> = ({ url }) => {
  const iframeRef = React.useRef<HTMLIFrameElement>();
  const [iframeLoaded, setIframeLoaded] = React.useState(false);
  const [iframeHeight, setIframeHeight] = React.useState<number | 'unset'>('unset');
  const [mediaUrl, setMediaUrl] = React.useState(null);
  const [mediaShouldLoad, setMediaShouldLoad] = React.useState(false);
  const [readMore, setReadMore] = React.useState(false);

  const ipfsId = React.useMemo(() => extractIPFSHash(url), [url]);
  const tokenAddress = ipfsId || url;
  const tokenInWhiteList = !!localStorage.getItem(`${TOKEN_WHITE_LIST_LOCATION}/${tokenAddress}`);

  React.useEffect(() => {
    setIframeHeight('unset');
    setMediaUrl(null);
    setIframeLoaded(false);
    setMediaShouldLoad(false);
    setReadMore(false);
    iframeRef.current?.contentWindow.postMessage({ mediaUrl: '', width: 0 });
  }, [url]);

  React.useEffect(() => {
    if (tokenInWhiteList && !iframeLoaded) setMediaShouldLoad(true);
  }, [tokenInWhiteList, iframeLoaded]);

  // Request IPFS file if it's an IPFS link. Set link meanwhile anyway
  React.useEffect(() => {
    if (mediaShouldLoad) {
      if (ipfsId) {
        ipcRenderer.send(IPFS_IPC_ID, {
          type: IpfsAction.GET,
          payload: {
            ipfsId,
          },
        });

        // Set fallback in case IPFS data never streams to our node
        setMediaUrl(`${DEFAULT_IPFS_FALLBACK_GATEWAY}/${ipfsId}`);
      } else {
        setMediaUrl(url);
      }
    }
  }, [url, ipfsId, mediaShouldLoad]);

  // Listen for IPFS files
  React.useEffect(() => {
    const listener = (_, data) => {
      if (data.type === IpfsAction.GET && ipfsId) {
        setMediaUrl(data.payload.filedata);
      }
    };

    ipcRenderer.on(IPFS_IPC_ID, listener);

    return () => {
      ipcRenderer.removeListener(IPFS_IPC_ID, listener);
    };
  }, [ipfsId]);

  // Post media to iframe, along with actual iframe width
  React.useEffect(() => {
    if (iframeLoaded) {
      iframeRef.current?.contentWindow.postMessage(
        { mediaUrl, width: iframeRef?.current.offsetWidth },
        '*'
      );
    }
  }, [mediaUrl, iframeRef, iframeLoaded]);

  // Adjust iframe height based on content height
  React.useEffect(() => {
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
  }, [iframeRef]);

  function addTokenToWhiteList() {
    localStorage.setItem(`${TOKEN_WHITE_LIST_LOCATION}/${tokenAddress}`, `${tokenAddress}`);
    setMediaShouldLoad(true);
  }

  function removeTokenFromWhiteList() {
    localStorage.removeItem(`${TOKEN_WHITE_LIST_LOCATION}/${tokenAddress}`);
    setMediaShouldLoad(false);
    setIframeLoaded(false);
  }

  const Buttons = () => (
    <ButtonWrapper>
      <ButtonSmall type="button" theme="success" onClick={() => setMediaShouldLoad(true)}>
        View once
      </ButtonSmall>
      <ButtonSmall type="button" theme="purple" onClick={() => addTokenToWhiteList()}>
        View always
      </ButtonSmall>
    </ButtonWrapper>
  );

  return (
    <>
      {mediaShouldLoad && (
        <>
          <MediaContent>
            <ImageFrame>
              <TokenMediaIframe
                height={iframeHeight}
                ref={iframeRef}
                src={`file://${__dirname}/externalMedia.html`}
                onLoad={() => {
                  setIframeLoaded(true);
                  setMediaShouldLoad(true);
                }}
              />
            </ImageFrame>
          </MediaContent>
          <ButtonWrapper>
            <ButtonSmall
              type="button"
              theme="transparent"
              onClick={() => removeTokenFromWhiteList()}
            >
              Hide Image
            </ButtonSmall>
          </ButtonWrapper>
        </>
      )}
      {!mediaShouldLoad && (
        <div
          style={{
            textAlign: 'center',
            backgroundColor: 'var(--color-lighterBlack)',
            borderRadius: 'var(--border-radius)',
            padding: '0 8px 16px 8px',
            marginTop: '16px',
            overflowY: 'hidden',
          }}
        >
          <DisclaimerHeader>Image Preview Disclaimer</DisclaimerHeader>

          {!readMore && (
            <>
              <DisclaimerText>
                {DisclaimerTextContent.par1.substring(0, 180)}...
                <a href="#" onClick={() => setReadMore(true)}>
                  {' '}
                  Read more
                </a>
              </DisclaimerText>
              <Buttons />
            </>
          )}

          {readMore && (
            <>
              <DisclaimerText>{DisclaimerTextContent.par1}</DisclaimerText>
              <br />
              <DisclaimerText>{DisclaimerTextContent.par2}</DisclaimerText>
              <Buttons />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default TokenMediaDisplay;
