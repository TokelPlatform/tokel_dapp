/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import styled from '@emotion/styled';

import { V } from 'util/theming';

import { VSpaceMed } from 'components/Dashboard/widgets/common';
import DottedLoader from './_Loaders/DottedLoader';
import { ButtonSmall } from './buttons';
import { IconImg, StyledInput } from './Input';

const InputWithLabelRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const AboveInputContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  font-size: ${V.font.p};
  padding: 0 6px;
  margin-bottom: 6px;
`;

const Label = styled.label`
  color: var(--color-darkerGray);
`;

const Error = styled.span`
  margin: 0.5rem 0;
  color: var(--color-danger);
`;

const InputContainer = styled.div`
  display: flex;
`;

type InputWithLabelProps = {
  id: string;
  value: string;
  label: string;
  button?: {
    text: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    loading?: boolean;
  };
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  icon?: string;
  autoFocus?: boolean;
  type?: string;
  error?: string;
  disabled?: boolean;
};

const InputWithLabel = ({
  id,
  value,
  label,
  button,
  onChange,
  onKeyDown,
  icon,
  error,
  placeholder,
  disabled,
  autoFocus,
  type = 'text',
}: InputWithLabelProps): React.ReactElement => {
  return (
    <InputWithLabelRoot>
      <AboveInputContainer>
        <Label htmlFor={id}>{label}</Label>
        <Error>{error}</Error>
      </AboveInputContainer>
      <InputContainer>
        {icon && <IconImg src={icon} />}
        <StyledInput
          id={id}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={value}
          placeholder={placeholder}
          icon={Boolean(icon)}
          autoFocus={autoFocus}
          disabled={disabled}
          width="flex"
          type={type}
        />
        {button && (
          <ButtonSmall
            theme="transparent"
            onClick={button.onClick}
            css={{ marginLeft: 6 }}
            disabled={button.loading}
          >
            <span>{button.loading ? <DottedLoader /> : button.text}</span>
          </ButtonSmall>
        )}
      </InputContainer>
      <VSpaceMed />
    </InputWithLabelRoot>
  );
};

export default InputWithLabel;
