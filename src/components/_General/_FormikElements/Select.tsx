import React from 'react';
import ReactSelect from 'react-select';
import CreatableReactSelect from 'react-select/creatable';

import { FieldHookConfig, useFormikContext } from 'formik';

import { useReactSelectStyles } from './common';
import FieldContainer from './FieldContainer';

type SelectOption = {
  label: string | number;
  value: string | number | boolean;
  __isNew__?: boolean;
};

interface SelectProps {
  creatable?: boolean;
  label?: string;
  help?: string;
  options: SelectOption[];
  formattedSelectedOption?: SelectOption;
  useOptionValueAsFieldValue?: boolean;
}

const Select: React.FC<SelectProps & FieldHookConfig<string>> = ({
  creatable,
  label,
  help,
  placeholder,
  options,
  formattedSelectedOption,
  useOptionValueAsFieldValue,
  ...props
}) => {
  const SelectComponent = creatable ? CreatableReactSelect : ReactSelect;

  const { setFieldValue, setFieldTouched } = useFormikContext();
  const customStyles = useReactSelectStyles();

  const handleChange = (option?: SelectOption) => {
    setFieldTouched(props.name, true);
    if (!option) setFieldValue(props.name, undefined);
    else setFieldValue(props.name, useOptionValueAsFieldValue ? option.value : option);
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
