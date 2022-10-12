import React, { useEffect, useMemo, useRef, useState } from 'react';

import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';

import { Responsive, extractIPFSHash } from 'util/helpers';
import { V } from 'util/theming';
import {
  DEFAULT_IPFS_FALLBACK_GATEWAY,
  IPFS_IPC_ID,
  IpfsAction,
  TOKEN_WHITE_LIST_LOCATION,
} from 'vars/defines';

import { ButtonSmall } from 'components/_General/buttons';
import FriendlyWarning from 'components/_General/WarningFriendly';

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
  justify-content: space-around;
  margin-top: 25px;
`;

const DisclaimerText = styled.div`
  text-align: left;
  font-size: 0.9rem;
`;

interface TokenMediaDisplayProps {
  url?: string;
}

const TokenMediaDisplay: React.FC<TokenMediaDisplayProps> = ({ url }) => {
  const iframeRef = useRef<HTMLIFrameElement>();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeHeight, setIframeHeight] = useState<number | 'unset'>('unset');
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaShouldLoad, setMediaShouldLoad] = useState(false);
  const [readMore, setReadMore] = useState(false);

  const ipfsId = useMemo(() => extractIPFSHash(url), [url]);
  const tokenAddress = ipfsId || url;
  const tokenInWhiteList = !!localStorage.getItem(`${TOKEN_WHITE_LIST_LOCATION}/${tokenAddress}`);

  useEffect(() => {
    setIframeHeight('unset');
    setMediaUrl(null);
    setIframeLoaded(false);
    setMediaShouldLoad(false);
    setReadMore(false);
    iframeRef.current?.contentWindow.postMessage({ mediaUrl: '', width: 0 });
  }, [url]);

  useEffect(() => {
    if (tokenInWhiteList && !iframeLoaded) setMediaShouldLoad(true);
  }, [tokenInWhiteList, iframeLoaded]);

  // Request IPFS file if it's an IPFS link. Set link meanwhile anyway
  useEffect(() => {
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
  useEffect(() => {
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
        <div style={{ textAlign: 'center' }}>
          <FriendlyWarning message="Image Preview Disclaimer" />

          {!readMore && (
            <div style={{ marginTop: '4px' }}>
              <DisclaimerText>
                The Tokel team does not own, endorse, host or content moderate anything that is
                shown in the dApp. By it&apos;s nature, the dApp...{' '}
                <a href="#" onClick={() => setReadMore(true)}>
                  Read more
                </a>
              </DisclaimerText>

              <ButtonWrapper>
                <ButtonSmall type="button" theme="success" onClick={() => setMediaShouldLoad(true)}>
                  View once
                </ButtonSmall>
                <ButtonSmall type="button" theme="purple" onClick={() => addTokenToWhiteList()}>
                  View and never ask again
                </ButtonSmall>
              </ButtonWrapper>
            </div>
          )}

          {readMore && (
            <>
              <DisclaimerText>
                The Tokel team does not own, endorse, host or content moderate anything that is
                shown in the dApp. By it&apos;s nature, the dApp merely reads the media URL&apos;s
                that are linked within the meta data of tokens that are created on the Tokel public
                blockchain. Content moderation issues should be addressed with the token creator,
                owner, or through the web host that stores the media itself.
              </DisclaimerText>
              <br />
              <DisclaimerText>
                By accepting this disclaimer, you are accepting that you have personally verified
                the source of the image and are happy for it to be displayed, knowing that there are
                no content moderators and you&apos;re taking all responsibility for viewing the
                media and any risks associated with that. You are accepting that anybody that
                participates in creating and/or shipping this open source software holds no
                liability for what is shown, and that the decision to proceed is completely
                voluntary and at your own risk.
              </DisclaimerText>

              <ButtonWrapper>
                <ButtonSmall type="button" theme="success" onClick={() => setMediaShouldLoad(true)}>
                  View once
                </ButtonSmall>
                <ButtonSmall type="button" theme="purple" onClick={() => addTokenToWhiteList()}>
                  View and never ask again
                </ButtonSmall>
              </ButtonWrapper>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default TokenMediaDisplay;
