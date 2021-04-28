import styled from '@emotion/styled';

import { Colors } from 'vars/defines';

type ButtonProps = {
  theme: string;
  customWidth?: string;
};

export const Button = styled.button<ButtonProps>`
  width: ${props => props.customWidth || '240px'};
  height: 40px;
  ${props => {
    switch (props.theme) {
      case Colors.PURPLE:
        return `
          background: var(--gradient-purple-direct);
          border: none;
        `;
      case Colors.BLACK:
        return `
          background: var(--color-button-black-theme);
          border: 1px solid var(--color-lighterBlack);`;
      case Colors.TRANSPARENT:
        return `
          background: var(--color-almostBlack);
          border: 1px solid var(--color-lighterBlack);`;
      default:
        // gray theme
        return `
          background: var(--gradient-gray);
          border: none;
          `;
    }
  }};
  border-radius: var(--border-radius);
  color: var(--color-white);
  font-size: 14px;
  font-weight: 400;
  &:focus {
    outline: none;
  }
`;

export const ButtonSmall = styled.button`
  background: var(--color-slateGray);
  border-radius: var(--border-radius);
  border: none;
  color: var(--color-white);
  font-size: 12px;
  font-weight: 400;
  padding: 4px 12px;
  &:focus {
    outline: none;
  }
`;
