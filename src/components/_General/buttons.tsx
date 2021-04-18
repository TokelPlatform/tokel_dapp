import styled from '@emotion/styled';

type ButtonProps = {
  theme: string;
  customWidth?: string;
};

export const Button = styled.button<ButtonProps>`
  width: ${props => props.customWidth || '240px'};
  height: 40px;
  background: ${props =>
    props.theme === 'purple' ? 'var(--gradient-purple-direct)' : 'var(--gradient-gray)'};
  border-radius: var(--border-radius);
  border: none;
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
