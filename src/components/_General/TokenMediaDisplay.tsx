import React, { useEffect, useState, useMemo } from 'react';
import { ipcRenderer } from 'electron';
import styled from '@emotion/styled';

import { Responsive, getContentType } from 'util/helpers';
import { V } from 'util/theming';
import { IPFS_IPC_ID, IpfsAction, checkIsIPFSLink, mediaTypes, HTTP_ERR_405 } from 'vars/defines';

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

const TokenImage = styled.img`
  max-width: 100%;
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
  const [imageUrl, setImageUrl] = useState(null);

  const isMedia = useMemo(
    () => !!contentType && mediaTypes.includes(contentType as typeof mediaTypes[number]),
    [contentType]
  );

  useEffect(() => {
    setImageUrl(null);
    setContentType(null);

    if (checkIsIPFSLink(url)) {
      setContentType('ipfs');
    } else {
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
    }
  }, [url]);

  useEffect(() => {
    if (contentType === 'ipfs') {
      ipcRenderer.send(IPFS_IPC_ID, {
        type: IpfsAction.GET,
        payload: {
          ipfsId: url?.split('/')[url?.split('/').length - 1],
        },
      });
    } else if (isMedia) {
      setImageUrl(url);
    }
  }, [contentType, url, isMedia]);

  useEffect(() => {
    ipcRenderer.on(IPFS_IPC_ID, (_, data) => {
      if (data.type === IpfsAction.GET && contentType === 'ipfs') {
        setImageUrl(data.payload.filedata);
      }
    });
  }, [contentType]);

  if (!isMedia) return null;

  return (
    <MediaContent>
      <ImageFrame>
        {!!url && !imageUrl && (
          <LoaderContainer>
            <Loader bgColor={V.color.back} />
          </LoaderContainer>
        )}

        {!!imageUrl && <TokenImage alt={url} src={imageUrl} title={url} />}
      </ImageFrame>
    </MediaContent>
  );
};

export default TokenMediaDisplay;
