import React from 'react';

import styled from '@emotion/styled';

import { V } from 'util/theming';
import { TokenDetail } from 'util/token-types';

import TokenMediaDisplay from 'components/_General/TokenMediaDisplay';

const Wrapper = styled.div`
  background-color: ${V.color.backSoftest};
  padding: 12px;
  border-radius: 4px;

  display: flex;

  & > span {
    height: 40px;
    width: 40px;
    /* background-color: ${V.color.back}; */
  }

  & > div {
    margin-left: 6px;
    display: flex;
    flex-direction: column;

    span {
      background-color: ${V.color.back};
    }

    span:first-child {
      height: 14px;
      width: 120px;
      margin-bottom: 4px;
    }

    span:last-child {
      height: 22px;
      width: 160px;
    }
  }
`;

interface AssetWidgetProps {
  asset?: TokenDetail;
}

const AssetWidget: React.FC<AssetWidgetProps> = ({ asset }) => {
  if (!asset)
    return (
      <Wrapper>
        <span />
        <div>
          <span />
          <span />
        </div>
      </Wrapper>
    );

  return (
    <Wrapper>
      <span>
        <TokenMediaDisplay url={asset.dataAsJson?.url} />
      </span>
      <div>
        <span>{asset.name}</span>
        <span>{asset.description}</span>
      </div>
    </Wrapper>
  );
};

export default AssetWidget;
