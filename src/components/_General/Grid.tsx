import styled from '@emotion/styled';

const Columns = styled.div`
  display: flex;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;

  margin-right: -${props => props.theme.grid.columnGap};
  margin-left: -${props => props.theme.grid.columnGap};
  margin-top: -${props => props.theme.grid.columnGap};

  &:last-child {
    margin-bottom: -${props => props.theme.grid.columnGap};
  }
  &:not(:last-child) {
    margin-bottom: calc(1.5rem - ${props => props.theme.grid.columnGap});
  }
`;

const Column = styled.div<{ size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 }>`
  flex: none;
  width: ${props => `${(props.size / 12) * 100}%`};
  padding: ${props => props.theme.grid.columnGap};
`;

export { Columns, Column };
