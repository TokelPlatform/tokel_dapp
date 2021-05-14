import { css } from '@emotion/react';

export const blankStyle = css``;

export const scrollbarStyle = css`
  ::-webkit-scrollbar {
    visibility: hidden;
    width: 6px;
    cursor: pointer;
  }
  ::-webkit-scrollbar-track {
    visibility: hidden;
    background: none;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--color-lightpurple);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-lessSaturatedBlue);
  }
  &:hover {
    ::-webkit-scrollbar-track,
    ::-webkit-scrollbar-thumb {
      visibility: visible;
    }
  }
`;
