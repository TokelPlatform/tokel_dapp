import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { upperFirst } from 'lodash-es';

import { ReactComponent as CopyIcon } from 'assets/copy.svg';
import { ReactComponent as LinkIcon } from 'assets/link.svg';
import { selectCurrentTokenDetail } from 'store/selectors';
import { V } from 'util/theming';

import { WidgetContainer, WidgetDivider } from './common';

const TokenDetailRoot = styled(WidgetContainer)`
  grid-column: span 4;
  grid-row: span 3;
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
  overflow: hidden;
`;

const ValueWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const MetadataItem = ({ name, value }: { name: string; value: unknown }) => {
  return (
    <MetadataItemRoot>
      <MetadataName>{upperFirst(name)}</MetadataName>
      <MetadataValue>
        <ValueWrapper>{value}</ValueWrapper>
      </MetadataValue>
    </MetadataItemRoot>
  );
};

const TokenDetail = () => {
  const tokenInfo = useSelector(selectCurrentTokenDetail);

  return (
    <TokenDetailRoot>
      <Header>
        <Name>{tokenInfo.name}</Name>
        <ExplorerLink hash={tokenInfo.tokenid} />
      </Header>
      <Content>
        <Description>{tokenInfo.description}</Description>
        <Metadata>
          <MetadataItem name="Supply" value={tokenInfo.supply} />
          <MetadataItem name="Creator" value={tokenInfo.owner} />
          <MetadataItem name="Royalty" value={tokenInfo.dataAsJson.royalty} />
          <MetadataItem name="URL" value={tokenInfo.dataAsJson.url} />
          <WidgetDivider />
          {Object.entries(tokenInfo.dataAsJson?.arbitraryAsJson ?? []).map(([k, v]) => (
            <MetadataItem key={k} name={k} value={v} />
          ))}
        </Metadata>
      </Content>
    </TokenDetailRoot>
  );
};

export default TokenDetail;
