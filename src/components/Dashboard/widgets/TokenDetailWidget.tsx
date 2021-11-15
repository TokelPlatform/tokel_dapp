import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { upperFirst } from 'lodash-es';

import { selectCurrentTokenDetail } from 'store/selectors';
import { Responsive, limitLength } from 'util/helpers';
import { V } from 'util/theming';

import { Columns, Column } from 'components/_General/Grid';
import CopyToClipboard from 'components/_General/CopyToClipboard';
import ExplorerLink from 'components/_General/ExplorerLink';
import TokenMediaDisplay from 'components/_General/TokenMediaDisplay';
import { VSpaceSmall, WidgetContainer } from './common';

const TokenDetailRoot = styled(WidgetContainer)`
  grid-column: span 5;
  grid-row: span 3;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: 25px;
  border-bottom: 1px solid ${V.color.backSoftest};
`;

const Name = styled.div`
  display: block;
  font-size: ${V.font.h2};
  margin-bottom: 6px;
`;

const Content = styled.div`
  padding: 25px;
  display: flex;
  overflow: hidden;
  overflow-wrap: break-word;
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

const Description = styled.p``;

const Metadata = styled.div`
  color: ${V.color.frontOp[50]};
`;

const MetadataItemRoot = styled.div`
  display: flex;
`;

const MetadataName = styled.div`
  width: 25%;
  max-width: 200px;
`;

const MetadataValue = styled.div`
  flex-basis: 70%;
  flex-grow: 1;
  overflow: auto;
`;

const ValueWrapper = styled.div`
  width: 100%;
  display: flex;
`;

const ContentLink = styled.a`
  display: block;
  margin-top: 4px;
  overflow: auto;
  color: ${V.color.front};
`;

type MetadataItemProps = {
  name: string;
  value: unknown;
  copyValue?: string;
};

const MetadataItem = ({ name, value, copyValue }: MetadataItemProps) => (
  <MetadataItemRoot>
    <MetadataName>{upperFirst(name)}</MetadataName>
    <MetadataValue>
      <ValueWrapper>
        {value} {copyValue && <CopyToClipboard textToCopy={copyValue} color="white" />}
      </ValueWrapper>
    </MetadataValue>
  </MetadataItemRoot>
);

const TokenDetail = () => {
  const tokenDetail = useSelector(selectCurrentTokenDetail);

  return (
    <TokenDetailRoot>
      <Header>
        <Name>{tokenDetail.name}</Name>
        <ExplorerLink type="tokens" txid={tokenDetail.tokenid} postfix="transactions" />
      </Header>
      <Content>
        <Columns style={{ overflow: 'auto' }}>
          <Column size={7}>
            <MetadataContent>
              <Description>{tokenDetail.description}</Description>
              {tokenDetail.dataAsJson?.url && (
                <ContentLink
                  target="_blank"
                  rel="noopener noreferrer"
                  href={tokenDetail.dataAsJson?.url}
                >
                  {tokenDetail.dataAsJson?.url}
                </ContentLink>
              )}
              <VSpaceSmall />
              <Metadata>
                {tokenDetail.supply > 1 && (
                  <MetadataItem name="Supply" value={tokenDetail.supply} />
                )}
                <MetadataItem
                  name="Creator"
                  value={`${limitLength(tokenDetail.owner, 24)} ...`}
                  copyValue={tokenDetail.owner}
                />
                {tokenDetail.dataAsJson?.royalty && (
                  <MetadataItem name="Royalty" value={`${tokenDetail.dataAsJson.royalty / 10}%`} />
                )}
                {tokenDetail.dataAsJson?.id.toString() && (
                  <MetadataItem name="ID" value={tokenDetail.dataAsJson.id} />
                )}
                {Object.entries(tokenDetail.dataAsJson?.arbitraryAsJson ?? []).map(([k, v]) => (
                  <MetadataItem key={k} name={k} value={v} />
                ))}
              </Metadata>
            </MetadataContent>
          </Column>
          <Column size={5} style={{ overflow: 'auto' }}>
            <TokenMediaDisplay url={tokenDetail?.dataAsJson?.url} />
          </Column>
        </Columns>
      </Content>
    </TokenDetailRoot>
  );
};

export default TokenDetail;
