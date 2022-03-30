import React from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
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
  disabled?: boolean;
  min?: number;
  max?: number;
  append?: string;
  appendLight?: boolean;
}

const Field: React.FC<FieldProps & FieldHookConfig<string>> = ({
  label,
  help,
  readOnly,
  disabled,
  min,
  max,
  append,
  appendLight,
  onFocus,
  ...props
}) => {
  const [field] = useField(props);

  return (
    <FieldContainer label={label} help={help} append={append} appendLight={appendLight} {...props}>
      {props.type === 'textarea' ? (
        <Textarea
          {...field}
          placeholder={props.placeholder}
          onFocus={onFocus as React.FocusEventHandler<HTMLTextAreaElement>}
        />
      ) : (
        <Input
          {...field}
          value={field?.value || ''}
          readOnly={readOnly}
          disabled={disabled}
          min={min}
          max={max}
          placeholder={props.placeholder}
          type={props.type}
          onFocus={onFocus as React.FocusEventHandler<HTMLInputElement>}
        />
      )}
    </FieldContainer>
  );
};

export default Field;
