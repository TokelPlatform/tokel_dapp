import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { upperFirst } from 'lodash-es';

import linkIcon from 'assets/link.svg';
import { selectCurrentTokenDetail } from 'store/selectors';
import { Responsive, extractIPFSHash, limitLength } from 'util/helpers';
import { V } from 'util/theming';
import {
  Colors,
  DEFAULT_IPFS_FALLBACK_GATEWAY,
  EXTRACT_IPFS_HASH_REGEX,
  RESERVED_TOKEL_ARBITRARY_KEYS,
} from 'vars/defines';

import { Button } from 'components/_General/buttons';
import CopyToClipboard from 'components/_General/CopyToClipboard';
import ExplorerLink from 'components/_General/ExplorerLink';
import { Column, Columns } from 'components/_General/Grid';
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
  width: 50%;
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

const OpenInGatewayButton = styled(Button)`
  margin-top: 1rem;
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

const TokenDetail: React.FC = () => {
  const tokenDetail = useSelector(selectCurrentTokenDetail);

  const arbitraryJson = tokenDetail.dataAsJson?.arbitraryAsJson;

  const tokenUrl = tokenDetail.dataAsJson?.url;
  const [tokenGatewayUrl, setTokenGatewayUrl] = React.useState(null);

  const hasNumberInCollection =
    arbitraryJson?.number_in_collection || arbitraryJson?.number_in_constellation;
  const hasCollectionName = arbitraryJson?.collection_name || arbitraryJson?.constellation_name;

  React.useEffect(() => {
    const ipfsId = extractIPFSHash(tokenUrl);

    if (ipfsId) {
      setTokenGatewayUrl(`${DEFAULT_IPFS_FALLBACK_GATEWAY}/${ipfsId}`);
    } else {
      setTokenGatewayUrl(tokenUrl);
    }
  }, [tokenUrl]);

  return (
    <TokenDetailRoot>
      <Header>
        <Name>{tokenDetail.name}</Name>
        <ExplorerLink type="tokens" txid={tokenDetail.tokenid} postfix="transactions" />
      </Header>
      <Content>
        <Columns css={{ overflow: 'auto' }}>
          <Column size={7}>
            <MetadataContent>
              <Description>{tokenDetail.description}</Description>
              {tokenUrl && (
                <>
                  <ContentLink target="_blank" rel="noopener noreferrer" href={tokenUrl}>
                    {tokenUrl}
                  </ContentLink>
                  {tokenUrl.match(EXTRACT_IPFS_HASH_REGEX) && (
                    <OpenInGatewayButton theme={Colors.TRANSPARENT}>
                      <a
                        style={{ color: 'white' }}
                        href={tokenGatewayUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open in gateway
                        <img css={{ margin: '0 0 0 5px' }} src={linkIcon} alt="open-in-explorer" />
                      </a>
                    </OpenInGatewayButton>
                  )}
                </>
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
                {tokenDetail.dataAsJson?.id?.toString() && (
                  <MetadataItem name="Collection ID" value={tokenDetail.dataAsJson.id} />
                )}
                {hasCollectionName && (
                  <MetadataItem
                    name="Collection Name"
                    value={arbitraryJson?.collection_name || arbitraryJson?.constellation_name}
                  />
                )}
                {hasNumberInCollection && (
                  <MetadataItem
                    name="Number in Collection"
                    value={
                      arbitraryJson?.number_in_collection || arbitraryJson?.number_in_constellation
                    }
                  />
                )}
                {Object.entries(arbitraryJson ?? [])
                  ?.filter(([key]) => !RESERVED_TOKEL_ARBITRARY_KEYS.includes(key))
                  .map(([key, value]) => (
                    <MetadataItem key={key} name={key} value={value} />
                  ))}
              </Metadata>
            </MetadataContent>
          </Column>
          <Column size={5} css={{ overflow: 'auto' }}>
            <TokenMediaDisplay url={tokenUrl} />
          </Column>
        </Columns>
      </Content>
    </TokenDetailRoot>
  );
};

export default TokenDetail;
