import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import icons from '../assets/icons';

const Container = styled.div`
  height: 80px;
  width: 96px;
  font-size: 13px;
  color: var(--color-darkerGray);
  text-align: center;
  margin-bottom: 1rem;
  &: hover {
    color: var(--color-white);
    cursor: pointer;
  }
`;

type MenuItemProps = {
  itemName: string;
};

const MenuItem = ({ itemName }: MenuItemProps): ReactElement => {
  return (
    <Container>
      <img alt="menu-item" src={icons[itemName]} />
      <p>{itemName}</p>
    </Container>
  );
};

export default MenuItem;
