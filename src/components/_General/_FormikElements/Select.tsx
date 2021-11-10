import React from 'react';
import { FieldHookConfig, useFormikContext } from 'formik';

import ReactSelect from 'react-select';
import CreatableReactSelect from 'react-select/creatable';

import { useReactSelectStyles } from './common';
import FieldContainer from './FieldContainer';

type SelectOption = {
  label: string;
  value: string;
};

interface SelectProps {
  creatable?: boolean;
  label?: string;
  help?: string;
  options: SelectOption[];
}

const Select: React.FC<SelectProps & FieldHookConfig<string>> = ({
  creatable,
  label,
  help,
  placeholder,
  options,
  ...props
}) => {
  const SelectComponent = creatable ? CreatableReactSelect : ReactSelect;

  const { setFieldValue, setFieldTouched } = useFormikContext();
  const customStyles = useReactSelectStyles();

  const handleChange = (value?: SelectOption) => {
    console.log(value, 'value');
    setFieldTouched(props.name, true);
    if (!value) setFieldValue(props.name, undefined);
    else setFieldValue(props.name, value.value);
  };

  return (
    <FieldContainer label={label} help={help} {...props}>
      <SelectComponent
        placeholder={placeholder}
        onChange={handleChange}
        options={options}
        styles={customStyles}
        isClearable
      />
    </FieldContainer>
  );
};

Select.defaultProps = {};

export default Select;
