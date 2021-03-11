import React, { ReactElement } from 'react';
import styled from '@emotion/styled';
import data from './data';
import MenuItem from './MenuItem';

const Container = styled.div`
  position: absolute;
  background-color: var(--color-almostBlack);
  left: 0;
  top: 0;
  height: 720px;
  width: 96px;
`;

const Menu = styled.div`
  margin-top: 72px;
`;

const SideMenu = (): ReactElement => {
  return (
    <Container>
      <Menu>
        {data.map((menuItem) => {
          return <MenuItem key={menuItem.name} itemName={menuItem.name} />;
        })}
      </Menu>
    </Container>
  );
};

export default SideMenu;
