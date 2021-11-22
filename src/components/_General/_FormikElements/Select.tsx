import React from 'react';
import { FieldHookConfig, useFormikContext } from 'formik';

import ReactSelect from 'react-select';
import CreatableReactSelect from 'react-select/creatable';

import { useReactSelectStyles } from './common';
import FieldContainer from './FieldContainer';

type SelectOption = {
  label: string;
  value: string;
  __isNew__?: boolean;
};

interface SelectProps {
  creatable?: boolean;
  label?: string;
  help?: string;
  options: SelectOption[];
  formattedSelectedOption?: SelectOption;
}

const Select: React.FC<SelectProps & FieldHookConfig<string>> = ({
  creatable,
  label,
  help,
  placeholder,
  options,
  formattedSelectedOption,
  ...props
}) => {
  const SelectComponent = creatable ? CreatableReactSelect : ReactSelect;

  const { setFieldValue, setFieldTouched } = useFormikContext();
  const customStyles = useReactSelectStyles();

  const handleChange = (option?: SelectOption) => {
    setFieldTouched(props.name, true);
    if (!option) setFieldValue(props.name, undefined);
    else setFieldValue(props.name, option);
  };

  return (
    <FieldContainer label={label} help={help} {...props}>
      <SelectComponent
        value={formattedSelectedOption}
        placeholder={placeholder}
        onChange={handleChange}
        options={options}
        styles={customStyles}
        isClearable
      />
    </FieldContainer>
  );
};

export { SelectOption };
export default Select;
