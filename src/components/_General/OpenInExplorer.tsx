import React from 'react';

import styled from '@emotion/styled';

import linkIcon from 'assets/link.svg';

const ImgClickableWrapper = styled.a`
  cursor: pointer;
  background: transparent;
  border: none;
  display: flex;
`;

type CopyProps = {
  link: string;
  color?: string;
  width?: string;
};

const OpenInExplorer = ({ link, color, width }: CopyProps) => {
  return (
    <ImgClickableWrapper href={link} rel="noreferrer" target="_blank">
      <img style={{ color }} src={linkIcon} width={width} alt="open-in-explorer" />
    </ImgClickableWrapper>
  );
};

export default OpenInExplorer;
