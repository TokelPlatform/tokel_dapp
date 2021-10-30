import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import tokelIcon from 'assets/logo.svg';
import { V } from 'util/theming';
import { PORTFOLIO_ITEM_HEIGHT_PX } from 'vars/defines';

type PortfolioItemRootProps = { selected: boolean };

const PortfolioItemRoot = styled.div<PortfolioItemRootProps>`
  display: flex;
  align-items: center;
  min-height: ${PORTFOLIO_ITEM_HEIGHT_PX}px;
  height: ${PORTFOLIO_ITEM_HEIGHT_PX}px;
  background-color: ${props =>
    props.selected ? 'var(--color-almostBlack2)' : 'var(--color-almostBlack))'};
  border-left: 2px solid transparent;
  border-image: ${props => (props.selected ? 'var(--gradient-purple-direct) 1 100%' : 'none')};
  color: var(--color-white);
  cursor: pointer;
  flex-direction: row;
  padding: 8px 24px;
  &:hover {
    background-color: var(--color-almostBlack2);
  }
`;

const IconWrapper = styled.div`
  display: block;
  height: 32px;
  width: 32px;
`;

const Information = styled.div`
  display: flex;
  flex: 1;
  margin-left: 8px;
  flex-direction: column;
  justify-content: center;
  padding-left: 8px;
`;

const Name = styled.h3`
  margin: 0;
`;

const Amount = styled.p`
  color: var(--color-gray);
  margin: 0;
`;

const NFTBadge = styled.div`
  padding: 0 6px;
  border: 1px solid ${V.color.frontOp[50]};
  border-radius: ${V.size.borderRadius};
  &:before {
    font-size: ${V.font.pSmaller};
    color: ${V.color.cornflower};
    content: 'NFT';
    position: relative;
    top: -1px;
  }
`;

type PortfolioItemProps = {
  name: string;
  subtitle?: string;
  icon?: boolean;
  nft?: boolean;
  selected?: boolean;
  onClick?: () => void;
};

const PortfolioItem = ({
  name,
  subtitle,
  icon,
  nft,
  selected,
  onClick,
}: PortfolioItemProps): ReactElement => {
  return (
    <PortfolioItemRoot selected={selected} onClick={onClick}>
      {icon && (
        <IconWrapper>
          <img alt={`${name}-icon`} src={tokelIcon} />
        </IconWrapper>
      )}
      <Information>
        <Name>{name}</Name>
        <Amount>{subtitle}</Amount>
      </Information>
      {nft && <NFTBadge />}
    </PortfolioItemRoot>
  );
};

export default PortfolioItem;
