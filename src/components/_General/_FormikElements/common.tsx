import { GroupBase, StylesConfig } from 'react-select';

import { css } from '@emotion/react';

import { V } from 'util/theming';

const inputStyles = css`
  border-radius: 5px;
  background-color: ${V.color?.back};
  color: ${V.color?.frontSofter};
  border: 2px solid ${V.color?.backSoftest};
  font-size: ${V?.font.pSmall};
  padding: 10px;
  width: 100%;
  font-family: source-sans-pro, sans-serif;
  resize: none;

  &[readOnly],
  &[disabled] {
    background-color: ${V.color?.backSoftest};
    color: ${V.color?.frontOp[50]};
  }

  &:focus,
  &:hover {
    outline: none;
    border: 2px solid ${V.color?.cornflower};
  }
`;

const useReactSelectStyles = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customStyles: StylesConfig<any, false, GroupBase<any>> = {
    menu: provided => ({
      ...provided,
      backgroundColor: V.color?.backHard,
    }),

    control: provided => ({
      ...css(provided, inputStyles, {
        padding: '1px',
      }),
    }),

    input: provided => ({
      ...provided,
      color: V.color?.frontSofter,
    }),

    placeholder: provided => ({
      ...provided,
      marginRight: 'auto',
    }),

    singleValue: provided => ({
      ...provided,
      color: V.color?.frontSofter,
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? V.color?.cornflower : '',
    }),

    indicatorSeparator: () => ({
      display: 'none',
    }),

    indicatorsContainer: provided => ({
      ...css(
        provided,
        `
        svg {
          fill: ${V.color?.cornflower};
        }
      `
      ),
    }),
  };

  return customStyles;
};

export { useReactSelectStyles, inputStyles };
