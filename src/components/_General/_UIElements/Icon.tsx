import styled from '@emotion/styled';

const Icon = styled.div<{
  icon: string;
  height?: number;
  width?: number;
  color: 'frontSoft' | 'front' | 'gradient';
  centered?: boolean;
}>`
  height: ${props => `${props.height || 50}px`};
  width: ${props => `${props.width || 50}px`};
  background: ${props =>
    props.color === 'gradient'
      ? `var(--gradient-purple-horizontal)`
      : props.theme.color[props.color]};
  mask-size: contain;
  mask-position: center;
  mask-repeat: no-repeat;
  mask-image: url('${props => props.icon}');

  ${props =>
    props.centered &&
    `
      margin-left: auto;
      margin-right: auto;
  `}
`;

export default Icon;
