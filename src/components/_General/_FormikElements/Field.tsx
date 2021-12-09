import React from 'react';

import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { FieldHookConfig, useField } from 'formik';

import { V } from 'util/theming';
import { inputStyles } from './common';
import FieldContainer from './FieldContainer';

const Input = styled.input<{ readOnly?: boolean }>`
  ${inputStyles}

  ${props =>
    props.readOnly &&
    css`
      &[readOnly]:focus,
      &[readOnly]:hover {
        outline: none;
        border: 2px solid ${V.color?.backSoftest};
      }
    `}
`;

const Textarea = styled.textarea`
  ${inputStyles}
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
          {...field}
          value={field?.value || ''}
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
