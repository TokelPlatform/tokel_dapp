import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import parse from 'html-react-parser';
import { identicon } from 'minidenticons';

import tokelIcon from 'assets/logo.svg';
import { selectAccountAddress } from 'store/selectors';
import { V } from 'util/theming';

type PortfolioItemRootProps = { selected: boolean };

const PortfolioItemRoot = styled.div<PortfolioItemRootProps>`
  display: flex;
  align-items: center;
  height: 92px;
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

// const NFTBadge = () => <NFTBadgeRoot />;

type PortfolioItemProps = {
  name: string;
  subtitle?: string;
  header?: boolean;
  nft?: boolean;
  selected?: boolean;
  onClick?: () => void;
};

const PortfolioItem = ({
  name,
  subtitle,
  header,
  nft,
  selected,
  onClick,
}: PortfolioItemProps): ReactElement => {
  const address = useSelector(selectAccountAddress);
  return (
    <PortfolioItemRoot selected={selected} onClick={onClick}>
      <IconWrapper>
        {header ? (
          parse(identicon(address || 'sample'))
        ) : (
          <img alt={`${name}-icon`} src={tokelIcon} />
        )}
      </IconWrapper>
      <Information>
        <Name>{name}</Name>
        <Amount>{subtitle}</Amount>
      </Information>
      {nft && <NFTBadge />}
    </PortfolioItemRoot>
  );
};

// PortfolioItem.defaultProps = {

//   header: false,
//   selected: false,
//   onClick: () => 'me clickit',
// };

export default PortfolioItem;
