import styled from '@emotion/styled';

import { Colors } from 'vars/defines';

type ButtonProps = {
  theme: string;
  customWidth?: string;
  hasIcon?: boolean;
};

const getTheme = theme =>
  ({
    [Colors.PURPLE]: `
        background: var(--gradient-purple-direct);
        border: none;
      `,
    [Colors.BLACK]: `
        background: var(--color-button-black-theme);
        border: 1px solid var(--color-lighterBlack);`,
    [Colors.TRANSPARENT]: `
        background: var(--color-almostBlack);
        border: 1px solid var(--color-lighterBlack);`,
    [Colors.DANGER]: `
        &, &:hover {
          background: var(--color-danger);
        }
        border: 1px solid var(--color-window-close-hover);`,
    [Colors.SUCCESS]: `
        &, &:hover {
          background: var(--color-growth-darker);
        }
        border: 1px solid var(--color-window-maximize);`,
  }[theme] || `background: var(--gradient-gray); border: none;`);

export const Button = styled.button<ButtonProps>`
  width: ${props => props.customWidth || '240px'};
  height: 40px;
  border-radius: var(--border-radius);
  color: var(--color-white);
  font-size: 14px;
  font-weight: 400;

  ${props =>
    props.hasIcon &&
    `
    display: flex;
    align-items: center;
    justify-content: center;
    & > *:first-of-type {
      margin-right: 4px;
    }
  `}

  &:focus {
    outline: none;
  }

  ${props =>
    !props.disabled
      ? `&:hover {
      background: var(--gradient-purple-direct);
      }`
      : 'cursor: default'}

  ${props => (props.disabled ? getTheme(Colors.GRAY) : getTheme(props.theme))}
`;

export const ButtonSmall = styled.button`
  border-radius: var(--border-radius);
  color: var(--color-white);
  font-size: 14px;
  font-weight: 400;
  padding: 4px 12px;
  ${props => getTheme(props.theme)};
  &:focus {
    outline: none;
  }
`;
