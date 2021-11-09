import { css, useTheme } from '@emotion/react';
import { GroupBase, StylesConfig } from 'react-select';

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

export { useReactSelectStyles, inputStyles };
