import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import { identicon } from 'minidenticons';
import parse from 'html-react-parser';
import icons from '../assets/icons';
import ProgressBar from '../../_General/ProgressBar';

type PortfolioItemProps = {
  address: string;
  amount: string;
  header: boolean;
  name?: string;
  selected: boolean;
  tickerName?: string;
  value: number;
};

type ContainerProps = {
  selected: boolean;
};

const Container = styled.div<ContainerProps>`
  background-color: ${(props) =>
    props.selected ? 'rgba(104, 123, 247, 0.05)' : 'var(--color-almostBlack)'};
  border-left: ${(props) => (props.selected ? '2px solid' : 'none')};
  border-image: var(--gradient-purple-direct) 1 100%;
  height: 92px;
  // width: 100%;
  color: var(--color-white);
  display: flex;
  flex-direction: row;
  padding-left: 30px;
`;

const Amount = styled.p`
  color: var(--color-gray);
  margin: 0;
  margin-bottom: 0.25rem;
`;

const Information = styled.div`
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const IconWrapper = styled.div`
  width: 2rem;
  height: 2rem;
  margin-top: 1.25rem;
`;

const PortfolioItem = ({
  name,
  tickerName,
  amount,
  value,
  address,
  header,
  selected,
}: PortfolioItemProps): ReactElement => {
  const assetValue = (value * parseFloat(amount)).toFixed(2);
  return (
    <Container selected={selected}>
      {header ? (
        <IconWrapper>{parse(identicon(address || 'sample'))}</IconWrapper>
      ) : (
        <img alt="coin-icon" src={icons.happy} />
      )}
      <Information>
        <h3 style={{ margin: 0 }}>
          {`${header ? 'Your holdings' : name.concat(' ', tickerName)}`}
        </h3>
        <Amount>
          {`${amount} ${header ? 'assets' : tickerName} ≈ $${assetValue}`}
        </Amount>
        {!header && <ProgressBar percentage="100" length="120" />}
      </Information>
    </Container>
  );
};

PortfolioItem.defaultProps = {
  name: 'Tokel',
  tickerName: 'TKL',
};
export default PortfolioItem;
