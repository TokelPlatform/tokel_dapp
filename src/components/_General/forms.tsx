import React from 'react';

import styled from '@emotion/styled';
import { FieldHookConfig, useField } from 'formik';

const FieldContainer = styled.div`
  background-color: fuchsia;
`;

const Label = styled.label`
  font-size: 20px;
`;

const Input = styled.input`
  border-radius: 10px;
  border: 2px solid green;
  padding: 12px;
`;

export function FieldWithLabel(props: { label: string } & FieldHookConfig<string>) {
  const [field, meta] = useField(props);
  return (
    <FieldContainer>
      <Label>
        {props.label}
        <Input {...field} placeholder={props.placeholder} type={props.type} />
      </Label>
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </FieldContainer>
  );
}

export const X = 3;
