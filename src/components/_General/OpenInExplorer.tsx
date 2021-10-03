import React from 'react';

import styled from '@emotion/styled';

import linkIcon from 'assets/link.svg';

const ImgClickableWrapper = styled.a`
  cursor: pointer;
  background: transparent;
  border: none;
`;

type CopyProps = {
  link: string;
  color?: string;
};

const OpenInExplorer = ({ link, color }: CopyProps) => {
  return (
    <ImgClickableWrapper href={link} rel="noreferrer" target="_blank">
      <img style={{ color }} src={linkIcon} alt="open-in-explorer" />
    </ImgClickableWrapper>
  );
};

export default OpenInExplorer;
