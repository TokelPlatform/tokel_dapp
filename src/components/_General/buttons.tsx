import React from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { V } from 'util/theming';
import { Colors } from 'vars/defines';

import DottedLoader from './_Loaders/DottedLoader';

interface ButtonProps {
  theme: string;
  customWidth?: string;
  hasIcon?: boolean;
  loading?: boolean;
}

const getTheme = theme =>
  ({
    [Colors.PURPLE]: css`
      background: var(--gradient-purple-direct);
      border: none;
      &:hover {
        opacity: 0.9;
      }
    `,
    [Colors.BLACK]: css`
      background: var(--color-button-black-theme);
      border: 1px solid var(--color-lighterBlack);
    `,
    [Colors.TRANSPARENT]: css`
      background: var(--color-almostBlack);
      border: 1px solid var(--color-lighterBlack);
      &:hover {
        background-color: ${V.color.backHard};
      }
      > span {
        opacity: 0.7;
      }
    `,
    [Colors.PURPLE]: `
      background: var(--color-almostBlack);
      border: 1px solid var(--color-purple);
    `,
    [Colors.DANGER]: css`
      &,
      &:hover {
        background: var(--color-danger);
      }
      border: 1px solid var(--color-window-close-hover);
    `,
    [Colors.SUCCESS]: css`
      &,
      &:hover {
        background: var(--color-growth-darker);
      }
      border: 1px solid var(--color-window-maximize);
    `,
  }[theme] || `background: var(--gradient-gray); border: none;`);

export const Button = styled.button<ButtonProps>`
  width: ${props => props.customWidth || '240px'};
  height: 40px;
  border-radius: var(--border-radius);
  color: var(--color-white);
  font-size: 14px;
  font-weight: 400;
  position: relative;

  @keyframes button-loading-spinner {
    from {
      transform: rotate(0turn);
    }

    to {
      transform: rotate(1turn);
    }
  }

  ${props =>
    props.loading &&
    css`
      text-indent: -9999em; /* hide text */

      &:after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border: 4px solid transparent;
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: button-loading-spinner 1s ease infinite;
      }
    `}

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
      ? css`
          &:hover {
            background: var(--gradient-purple-direct);
            border: ${V.color.lilac};
          }
        `
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

interface SubmitButtonProps extends ButtonProps {
  text?: React.ReactNode;
  submitting?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
}

export const SubmitButton = ({ text, submitting, disabled, ...buttonProps }: SubmitButtonProps) => (
  <Button type="submit" disabled={disabled || submitting} {...buttonProps}>
    {submitting ? <DottedLoader /> : text}
  </Button>
);
