import React from 'react';

import styled from '@emotion/styled';

import links from 'util/links';
import { V } from 'util/theming';
import { TokenDetail } from 'util/token-types';
import { TICKER } from 'vars/defines';

import OpenInExplorer from 'components/_General/OpenInExplorer';
import TokenMediaDisplay from 'components/_General/TokenMediaDisplay';

const Wrapper = styled.div<{ isPlaceholder?: boolean }>`
  background-color: ${V.color.backSoftest};
  padding: 12px;
  border-radius: 4px;

  display: flex;

  & > span {
    height: 40px;
    width: 40px;
    ${props => props.isPlaceholder && `background-color: ${V.color.back};`}
  }

  & > div {
    margin-left: 6px;
    display: flex;
    flex-direction: column;

    ${props =>
      !props.isPlaceholder &&
      `
      &:last-child {
        margin: auto;
      }
  `}

    span {
      ${props => props.isPlaceholder && `background-color: ${V.color.back};`}

      h1 {
        text-align: left;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 16px;
        margin: 0;
      }

      h2 {
        font-size: 14px;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
      }
    }

    span:first-child {
      height: 14px;
      min-width: 120px;
      margin-bottom: 4px;
    }

    span:last-child {
      height: 22px;
      min-width: 160px;
    }
  }
`;

interface AssetWidgetProps {
  asset?: TokenDetail;
}

const AssetWidget: React.FC<AssetWidgetProps> = ({ asset }) => {
  if (!asset)
    return (
      <Wrapper isPlaceholder>
        <span />
        <div>
          <span />
          <span />
        </div>
      </Wrapper>
    );

  const link = links.explorers[TICKER](`tokens/${asset.tokenid}/transactions`);

  return (
    <>
      <Wrapper>
        <span>
          <TokenMediaDisplay url={asset.dataAsJson?.url} />
        </span>
        <div>
          <span>
            <h1>{asset.name}</h1>
          </span>
          <span>
            <h2>{asset.description}</h2>
          </span>
        </div>
        <div>
          <OpenInExplorer link={link} />
        </div>
      </Wrapper>
    </>
  );
};

export default AssetWidget;
