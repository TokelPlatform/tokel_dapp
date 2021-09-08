import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { upperFirst } from 'lodash-es';

import { ReactComponent as CopyIcon } from 'assets/copy.svg';
import { ReactComponent as LinkIcon } from 'assets/link.svg';
import { selectCurrentTokenDetail } from 'store/selectors';
import { Responsive } from 'util/helpers';
import { V } from 'util/theming';

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

const ExplorerLinkRoot = styled.div`
  display: flex;
`;

const Hash = styled.a`
  color: ${V.color.cornflower};
  margin-right: 8px;
  &:hover {
    color: ${V.color.cornflower};
  }
`;

const IconButton = styled.div`
  height: 20px;
  width: 20px;
  margin: 0 4px;
  cursor: pointer;
  stroke: ${V.color.frontOp[50]};
`;

const ExplorerLink = ({ hash }: { hash: string }) => {
  return (
    <ExplorerLinkRoot>
      <Hash>{hash}</Hash>
      {/* <StyledCopyIcon /> */}
      <IconButton>
        <CopyIcon />
      </IconButton>
      <IconButton>
        <LinkIcon />
      </IconButton>
    </ExplorerLinkRoot>
  );
};

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
  const tokenInfo = useSelector(selectCurrentTokenDetail);

  return (
    <TokenDetailRoot>
      <Header>
        <Name>{tokenInfo.name}</Name>
        <ExplorerLink hash={tokenInfo.tokenid} />
      </Header>
      <Content>
        <MetadataContent>
          <Description>
            {tokenInfo.description}
            <ContentLink target="_blank" rel="noopener noreferrer" href={tokenInfo.dataAsJson.url}>
              {tokenInfo.dataAsJson.url}
            </ContentLink>
          </Description>
          <Metadata>
            <MetadataItem name="Supply" value={tokenInfo.supply} />
            <MetadataItem name="Creator" value={tokenInfo.owner} />
            <MetadataItem name="Royalty" value={tokenInfo.dataAsJson.royalty} />
            <WidgetDivider />
            {Object.entries(tokenInfo.dataAsJson?.arbitraryAsJson ?? []).map(([k, v]) => (
              <MetadataItem key={k} name={k} value={v} />
            ))}
          </Metadata>
        </MetadataContent>
        <MediaContent>
          <ImageFrame>
            <TokenImage
              alt="Big Buck Bunny"
              src={tokenInfo.dataAsJson.url}
              title="No video playback capabilities, please download the video below"
            />
          </ImageFrame>
        </MediaContent>
      </Content>
    </TokenDetailRoot>
  );
};

export default TokenDetail;
