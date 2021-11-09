import React from 'react';
import { FieldHookConfig, useField, useFormikContext } from 'formik';

import ReactSelect from 'react-select';
import CreatableReactSelect from 'react-select/creatable';

import { Label, FieldContainer, useReactSelectStyles } from './common';

type SelectOption = {
  label: string;
  value: string;
};

interface SelectProps {
  creatable?: boolean;
  label?: string;
  options: SelectOption[];
}

const Select: React.FC<SelectProps & FieldHookConfig<string>> = ({
  creatable,
  label,
  placeholder,
  options,
  ...props
}) => {
  const SelectComponent = creatable ? CreatableReactSelect : ReactSelect;

  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [, meta] = useField(props);
  const customStyles = useReactSelectStyles();

  const handleChange = (value?: SelectOption) => {
    setFieldTouched(props.name, true);
    if (!value) setFieldValue(props.name, undefined);
    else setFieldValue(props.name, value.value);
  };

  return (
    <FieldContainer>
      {!!label && <Label>{label}</Label>}

      <SelectComponent
        placeholder={placeholder}
        onChange={handleChange}
        options={options}
        styles={customStyles}
        isClearable
      />

      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </FieldContainer>
  );
};

Select.defaultProps = {};

export default Select;
