import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import happyIcon from 'assets/happy.svg';

import ProgressBar from 'components/_General/ProgressBar';

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

const Icon = styled.img`
  display: block;
  height: 26px;
  width: 26px;
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

type PortfolioItemProps = {
  name: string;
  subtitle: string;
  percentage?: number;
  selected?: boolean;
  onClick?: () => void;
};

const PortfolioItem = ({
  name,
  subtitle,
  percentage,
  selected,
  onClick,
}: PortfolioItemProps): ReactElement => (
  <PortfolioItemRoot selected={selected} onClick={onClick}>
    <Icon alt={`${name}-icon`} src={happyIcon} />
    <Information>
      <Name>{name}</Name>
      <Amount>{subtitle}</Amount>
      {percentage && <ProgressBar percentage={percentage} />}
    </Information>
  </PortfolioItemRoot>
);

PortfolioItem.defaultProps = {
  percentage: null,
  selected: false,
  onClick: () => console.log('me clickit'),
};

export default PortfolioItem;
