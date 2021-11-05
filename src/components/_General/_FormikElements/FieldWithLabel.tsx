import React from 'react';

import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { FieldHookConfig, useField } from 'formik';

const inputStyles = theme => css`
  border-radius: 5px;
  background-color: ${theme.color?.back};
  color: ${theme.color?.frontSofter};
  border: 2px solid ${theme.color?.backSoftest};
  font-size: ${theme?.font.pSmall};
  padding: 10px;
  width: 100%;
  font-family: source-sans-pro, sans-serif;

  &:focus {
    outline: none;
    border: 2px solid ${theme.color?.cornflower};
  }
`;

const FieldContainer = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: ${props => props.theme?.font.p};
  color: ${props => props.theme.color?.frontOp[50]};
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
`;

const Input = styled.input`
  ${props => inputStyles(props.theme)}
`;

const Textarea = styled.textarea`
  ${props => inputStyles(props.theme)}
  min-height: 90px;
`;

export function FieldWithLabel(props: { label: string } & FieldHookConfig<string>) {
  const [field, meta] = useField(props);
  return (
    <FieldContainer>
      <Label>{props.label}</Label>
      {props.type === 'textarea' ? (
        <Textarea {...field} placeholder={props.placeholder} />
      ) : (
        <Input {...field} placeholder={props.placeholder} type={props.type} />
      )}
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </FieldContainer>
  );
}

export const X = 3;
