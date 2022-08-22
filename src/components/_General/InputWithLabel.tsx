/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import Input from 'components/_General/Input';
import { GrayLabel, VSpaceSmall } from 'components/Dashboard/widgets/common';

type InputWithLabelProps = {
  id?: string;
  placeholder: string;
  value: string;
  autoFocus?: boolean;
  width?: string;
  type?: string;
  onChange: (e) => void;
  onKeyDown: (e) => void;
  error: string;
  label: string;
};

const InputWithLabel = ({
  id,
  onChange,
  onKeyDown,
  value,
  placeholder,
  width,
  autoFocus,
  error,
  type,
  label,
}: InputWithLabelProps): React.ReactElement => {
  return (
    <label htmlFor={id}>
      <GrayLabel style={{ marginLeft: '2px' }}>{label}</GrayLabel>
      <VSpaceSmall />
      <Input
        id={id}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
        placeholder={placeholder}
        width={width}
        autoFocus={autoFocus}
        type={type}
        error={error}
      />
    </label>
  );
};

InputWithLabel.defaultProps = {
  id: '',
  autoFocus: false,
  width: '240px',
  type: 'text',
};
export default InputWithLabel;
