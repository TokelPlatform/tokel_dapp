import React from 'react';

import styled from '@emotion/styled';

import links from 'util/links';
import { V } from 'util/theming';
import { TokenDetail } from 'util/token-types';
import { TICKER } from 'vars/defines';

import OpenInExplorer from 'components/_General/OpenInExplorer';

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

    &:first-of-type {
      width: 70%;
    }

    ${props =>
      !props.isPlaceholder &&
      `
      &:last-child {
        margin-top: auto;
        margin-bottom: auto;
        margin-left: auto;
        margin-right: 16px;
      }
    `}

    span {
      ${props => props.isPlaceholder && `background-color: ${V.color.back};`}

      h1,
      h2 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
      }
      h1 {
        text-align: left;
        font-size: 16px;
      }

      h2 {
        font-size: 14px;
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
        <div>
          <span>
            <h1>{asset.name}</h1>
          </span>
          <span>
            <h2>{asset.description}</h2>
          </span>
        </div>
        <div>
          <OpenInExplorer width="18px" link={link} />
        </div>
      </Wrapper>
    </>
  );
};

export default AssetWidget;
