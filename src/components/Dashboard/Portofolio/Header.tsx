import React, { ReactElement } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  background-color: rgba(104, 123, 247, 0.05);
  height: 92px;
  color: var(--color-white);
  display: flex;
  flex-direction: row;
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

type PortfolioItemProps = {
  amount: string;
  value: number;
};
const Header = ({ amount, value }: PortfolioItemProps): ReactElement => (
  <Container>
    <Information>
      <h3 style={{ margin: 0 }}>Your Holdings</h3>
      <Amount>
        {amount} assets ≈ ${value * parseFloat(amount)}{' '}
      </Amount>
    </Information>
  </Container>
);

export default Header;
