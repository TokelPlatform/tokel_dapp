import React from 'react';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { V } from 'util/theming';

export const fadeKeyframes = keyframes`
  from {opacity: 1}
  to {opacity: 0}
`;

const DottedLoaderRoot = styled.div`
  width: 26px;
  display: inline-flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  div {
    width: 6px;
    height: 6px;
    border-radius: 10px;
    background-color: ${V.color.frontSoft};
    animation: ${fadeKeyframes} 0.8s ease-in-out alternate infinite;
  }
  div:nth-of-type(1) {
    animation-delay: -0.4s;
  }
  div:nth-of-type(2) {
    animation-delay: -0.2s;
  }
`;

const DottedLoader = (props: React.ComponentProps<typeof DottedLoaderRoot>) => (
  <DottedLoaderRoot {...props}>
    <div />
    <div />
    <div />
  </DottedLoaderRoot>
);

export default DottedLoader;
