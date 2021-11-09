import React from 'react';

import styled from '@emotion/styled';
import { FieldHookConfig, useField } from 'formik';

import { Label, FieldContainer, inputStyles } from './common';

const Input = styled.input`
  ${props => inputStyles(props.theme)}
`;

const Textarea = styled.textarea`
  ${props => inputStyles(props.theme)}
  min-height: 90px;
`;

interface FieldProps {
  label?: string;
}

const Field: React.FC<FieldProps & FieldHookConfig<string>> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <FieldContainer>
      {!!label && <Label>{label}</Label>}
      {props.type === 'textarea' ? (
        <Textarea {...field} placeholder={props.placeholder} />
      ) : (
        <Input value="" {...field} placeholder={props.placeholder} type={props.type} />
      )}
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </FieldContainer>
  );
};

export default Field;
