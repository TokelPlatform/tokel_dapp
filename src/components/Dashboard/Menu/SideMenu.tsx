import React, { ReactElement, useState } from 'react';
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
  const [menuData, setMenuData] = useState(data);

  const handleClick = (name) => {
    setMenuData(
      menuData.map((item) => {
        if (item.name !== name) {
          item.selected = false;
        } else {
          item.selected = true;
        }
        return item;
      })
    );
  };

  return (
    <Container>
      <Menu>
        {menuData.map((menuItem) => {
          return (
            <MenuItem
              onClick={() => handleClick(menuItem.name)}
              key={menuItem.name}
              itemName={menuItem.name}
              svgName={menuItem.svgName}
              selected={menuItem.selected}
            />
          );
        })}
      </Menu>
    </Container>
  );
};

export default SideMenu;
