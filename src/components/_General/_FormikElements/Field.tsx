import React from 'react';

import styled from '@emotion/styled';
import { FieldHookConfig, useField } from 'formik';

import { inputStyles } from './common';
import FieldContainer from './FieldContainer';

const Input = styled.input`
  ${props => inputStyles(props.theme)}
`;

const Textarea = styled.textarea`
  ${props => inputStyles(props.theme)}
  min-height: 90px;
`;

interface FieldProps {
  label?: string;
  help?: string;
  readOnly?: boolean;
  min?: number;
  max?: number;
  append?: string;
}

const Field: React.FC<FieldProps & FieldHookConfig<string>> = ({
  label,
  help,
  readOnly,
  min,
  max,
  append,
  ...props
}) => {
  const [field] = useField(props);

  return (
    <FieldContainer label={label} help={help} append={append} {...props}>
      {props.type === 'textarea' ? (
        <Textarea {...field} placeholder={props.placeholder} />
      ) : (
        <Input
          value=""
          {...field}
          readOnly={readOnly}
          min={min}
          max={max}
          placeholder={props.placeholder}
          type={props.type}
        />
      )}
    </FieldContainer>
  );
};

export default Field;
