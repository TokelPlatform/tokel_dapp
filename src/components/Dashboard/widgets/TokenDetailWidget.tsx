import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { ipcRenderer } from 'electron';
import { upperFirst } from 'lodash-es';

import { selectCurrentTokenDetail } from 'store/selectors';
import { Responsive } from 'util/helpers';
import { V } from 'util/theming';
import { IPFS_IPC_ID, IpfsAction } from 'vars/defines';

import ExplorerLink from 'components/_General/ExplorerLink';
import { WidgetContainer, WidgetDivider } from './common';

const TokenDetailRoot = styled(WidgetContainer)`
  grid-column: span 4;
  grid-row: span 3;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: 20px;
  border-bottom: 1px solid ${V.color.backSoftest};
`;

const Name = styled.div`
  display: block;
  font-size: ${V.font.h2};
  margin-bottom: 6px;
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  overflow: hidden;
  ${Responsive.below.L} {
    flex-direction: column;
  }
`;

const ContentSection = styled.div`
  overflow-y: auto;
`;

const MetadataContent = styled(ContentSection)`
  flex: 1;
  ${Responsive.below.L} {
    order: 2;
  }
`;

const MediaContent = styled(ContentSection)`
  display: flex;
  max-width: 50%;
  padding-left: 20px;
  ${Responsive.below.L} {
    order: 1;
    max-width: 100%;
    padding-left: 0;
    justify-content: center;
  }
`;

const Description = styled.p``;

const Metadata = styled.div`
  color: ${V.color.frontOp[50]};
`;

const MetadataItemRoot = styled.div`
  display: flex;
`;

const MetadataName = styled.div`
  width: 30%;
  max-width: 200px;
`;

const MetadataValue = styled.div`
  flex-basis: 70%;
  flex-grow: 1;
  overflow: auto;
`;

const ValueWrapper = styled.div`
  width: 100%;
`;

const ContentLink = styled.a`
  display: block;
  margin-top: 4px;
  overflow: auto;
  color: ${V.color.front};
`;

const ImageFrame = styled.div`
  max-width: 412px;
  padding: 16px;
  border: 1px solid ${V.color.backSoftest};
  border-radius: ${V.size.borderRadius};
  ${Responsive.below.L} {
    max-width: 300px;
  }
`;

const TokenImage = styled.img`
  width: 100%;
`;

const MetadataItem = ({ name, value }: { name: string; value: unknown }) => (
  <MetadataItemRoot>
    <MetadataName>{upperFirst(name)}</MetadataName>
    <MetadataValue>
      <ValueWrapper>{value}</ValueWrapper>
    </MetadataValue>
  </MetadataItemRoot>
);

const TokenDetail = () => {
  const tokenDetail = useSelector(selectCurrentTokenDetail);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (tokenDetail.dataAsJson.url.indexOf('ipfs') !== -1) {
      return setImageUrl(tokenDetail.dataAsJson.url);
    }

    return ipcRenderer.send(IPFS_IPC_ID, {
      type: IpfsAction.GET,
      payload: { url: tokenDetail.dataAsJson.url },
    });
  }, [tokenDetail]);

  useEffect(() => {
    ipcRenderer.on(IPFS_IPC_ID, (_, data) => {
      console.log('received image from IPFS');
      if (data.type === IpfsAction.GET) {
        setImageUrl(data.payload.filedata);
      }
    });
  }, []);

  return (
    <TokenDetailRoot>
      <Header>
        <Name>{tokenDetail.name}</Name>
        <ExplorerLink txid={tokenDetail.tokenid} />
      </Header>
      <Content>
        <MetadataContent>
          <Description>
            {tokenDetail.description}
            <ContentLink
              target="_blank"
              rel="noopener noreferrer"
              href={tokenDetail.dataAsJson.url}
            >
              {tokenDetail.dataAsJson.url}
            </ContentLink>
          </Description>
          <Metadata>
            <MetadataItem name="Supply" value={tokenDetail.supply} />
            <MetadataItem name="Creator" value={tokenDetail.owner} />
            <MetadataItem name="Royalty" value={tokenDetail.dataAsJson.royalty} />
            <WidgetDivider />
            {Object.entries(tokenDetail.dataAsJson?.arbitraryAsJson ?? []).map(([k, v]) => (
              <MetadataItem key={k} name={k} value={v} />
            ))}
          </Metadata>
        </MetadataContent>
        <MediaContent>
          <ImageFrame>
            <a href={tokenDetail.dataAsJson.url} rel="noreferrer" target="_blank">
              <TokenImage
                alt="Big Buck Bunny"
                src={imageUrl}
                title="No video playback capabilities, please download the video below"
              />
            </a>
          </ImageFrame>
        </MediaContent>
      </Content>
    </TokenDetailRoot>
  );
};

export default TokenDetail;
