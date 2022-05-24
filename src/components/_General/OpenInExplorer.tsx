import React from 'react';

import styled from '@emotion/styled';

import linkIcon from 'assets/link.svg';

const ImgClickableWrapper = styled.a<{ inline?: boolean }>`
  cursor: pointer;
  background: transparent;
  border: none;
  display: ${props => (props.inline ? 'inline-block' : 'flex')};
`;

type CopyProps = {
  link: string;
  color?: string;
  width?: string;
  inline?: boolean;
};

const OpenInExplorer = ({ link, color, width, inline }: CopyProps) => {
  return (
    <ImgClickableWrapper inline={inline} href={link} rel="noreferrer" target="_blank">
      <img style={{ color }} src={linkIcon} width={width} alt="open-in-explorer" />
    </ImgClickableWrapper>
  );
};

export default OpenInExplorer;
