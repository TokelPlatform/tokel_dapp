import styled from '@emotion/styled';
import { css, useTheme } from '@emotion/react';
import { GroupBase, StylesConfig } from 'react-select';

const FieldContainer = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: ${props => props.theme?.font.p};
  color: ${props => props.theme.color?.frontOp[50]};
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
`;

const inputStyles = theme => css`
  border-radius: 5px;
  background-color: ${theme.color?.back};
  color: ${theme.color?.frontSofter};
  border: 2px solid ${theme.color?.backSoftest};
  font-size: ${theme?.font.pSmall};
  padding: 10px;
  width: 100%;
  font-family: source-sans-pro, sans-serif;
  resize: none;

  &:focus,
  &:hover {
    outline: none;
    border: 2px solid ${theme.color?.cornflower};
  }
`;

const useReactSelectStyles = () => {
  const theme = useTheme();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customStyles: StylesConfig<any, false, GroupBase<any>> = {
    menu: provided => ({
      ...provided,
      backgroundColor: theme.color?.backHard,
    }),

    control: provided => ({
      ...css(provided, inputStyles(theme), {
        padding: '1px',
      }),
    }),

    input: provided => ({
      ...provided,
      color: theme.color?.frontSofter,
    }),

    singleValue: provided => ({
      ...provided,
      color: theme.color?.frontSofter,
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? theme.color?.cornflower : '',
    }),

    indicatorSeparator: () => ({
      display: 'none',
    }),

    indicatorsContainer: provided => ({
      ...css(
        provided,
        `
        svg {
          fill: ${theme.color?.cornflower};
        }
      `
      ),
    }),
  };

  return customStyles;
};

export { FieldContainer, Label, useReactSelectStyles, inputStyles };
