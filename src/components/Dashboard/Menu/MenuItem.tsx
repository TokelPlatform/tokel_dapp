import React, { ReactElement } from 'react';
import styled from '@emotion/styled';

type ContainerProps = {
  selected: boolean;
};

type MenuIconProps = {
  selected: boolean;
  svgName: string;
};

type MenuItemProps = {
  itemName: string;
  svgName: string;
  onClick: () => void;
  selected: boolean;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: 96px;
  font-size: 13px;
  color: ${(p) =>
    p.selected ? 'var(--color-white)' : 'var(--color-darkerGray)'};
  text-align: center;
  margin-bottom: 1rem;
  &: hover {
    opacity: 0.7;
    cursor: pointer;
  }
  p {
    margin: 0.5rem 0 0 0;
  }
`;

const MenuIcon = styled.div<MenuIconProps>`
  height: 24px;
  width: 24px;
  background: ${(p) =>
    p.selected
      ? 'var(--gradient-purple-horizontal)'
      : 'var(--color-darkerGray)'};
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  mask-image: ${(p) =>
    process.env.NODE_ENV === 'development'
      ? `url("./assets/${p.svgName}")`
      : `url("../../../src/components/Dashboard/assets/${p.svgName}")`};
`;

const MenuItem = ({
  itemName,
  svgName,
  onClick,
  selected,
}: MenuItemProps): ReactElement => {
  return (
    <Container onClick={onClick} selected={selected}>
      <MenuIcon svgName={svgName} selected={selected} />
      <p>{itemName}</p>
    </Container>
  );
};

export default MenuItem;
