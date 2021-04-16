import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import { identicon } from 'minidenticons';
import parse from 'html-react-parser';

const Container = styled.div`
  background-color: rgba(104, 123, 247, 0.05);
  height: 92px;
  color: var(--color-white);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 22px;
  padding-left: 30px;
`;

const Amount = styled.p`
  color: var(--color-gray);
  margin: 0;
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
  margin-bottom: 1.2rem;
`;

type PortfolioItemProps = {
  amount: string;
  value: number;
  address: string;
};

const Header = ({
  amount,
  value,
  address,
}: PortfolioItemProps): ReactElement => (
  <Container>
    <IconWrapper>{parse(identicon(address))}</IconWrapper>
    <Information>
      <h3 style={{ margin: 0 }}>Your Holdings</h3>
      <Amount>
        {amount} assets ≈ ${(value * parseFloat(amount)).toFixed(2)}{' '}
      </Amount>
    </Information>
  </Container>
);

export default Header;
