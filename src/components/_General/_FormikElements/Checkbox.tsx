import React from 'react';

import styled from '@emotion/styled';
import { FieldHookConfig, useField } from 'formik';

const Container = styled.label`
  display: flex;
  align-items: center;

  position: relative;
  cursor: pointer;
  font-size: ${props => props.theme.font.p};
  color: ${props => props.theme.color.frontSofter};
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding-left: 25px;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  &:hover input ~ span,
  input:checked ~ span {
    background-color: ${props => props.theme.color.cornflowerHard};
    border-color: ${props => props.theme.color.cornflowerHard};
  }

  input:checked ~ span:after {
    display: block;
  }
`;

const Checkmark = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: transparent;
  border: 1px solid ${props => props.theme.color.frontSofter};
  border-radius: ${props => props.theme.size.borderRadius};

  &:after {
    content: '';
    position: absolute;
    display: none;
    left: 6px;
    top: 4px;
    width: 3px;
    height: 6px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

const Checkbox: React.FC<{ label: string } & FieldHookConfig<string>> = props => {
  const [field, meta] = useField(props);

  return (
    <>
      <Container>
        {props.label}
        <input {...field} type="checkbox" />
        <Checkmark />
      </Container>
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </>
  );
};

Checkbox.defaultProps = {};

export default Checkbox;
