import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import happyIcon from 'assets/happy.svg';
import parse from 'html-react-parser';
import { identicon } from 'minidenticons';
import { selectAccountAddress } from 'store/selectors';

import ProgressBar from 'components/_General/ProgressBar';

const PortfolioItemRoot = styled.div`
  display: flex;
  align-items: center;
  height: 92px;
  background-color: var(--color-almostBlack);
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

type PortfolioItemProps = {
  name: string;
  subtitle: string;
  percentage?: number;
  header?: boolean;
};

const PortfolioItem = ({
  name,
  subtitle,
  percentage,
  header,
}: PortfolioItemProps): ReactElement => {
  const address = useSelector(selectAccountAddress);
  return (
    <PortfolioItemRoot>
      <IconWrapper>
        {header ? (
          parse(identicon(address || 'sample'))
        ) : (
          <img alt={`${name}-icon`} src={happyIcon} />
        )}
      </IconWrapper>
      <Information>
        <Name>{name}</Name>
        <Amount>{subtitle}</Amount>
        {percentage && <ProgressBar percentage={percentage} />}
      </Information>
    </PortfolioItemRoot>
  );
};

PortfolioItem.defaultProps = {
  percentage: null,
  header: false,
};

export default PortfolioItem;
