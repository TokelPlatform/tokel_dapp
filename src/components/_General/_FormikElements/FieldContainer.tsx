import React from 'react';

import styled from '@emotion/styled';
import Tippy from '@tippyjs/react';
import { FieldHookConfig, useField } from 'formik';

import InfoIcon from 'assets/HelperInfoCircle.svg';
import { V } from 'util/theming';

import Icon from 'components/_General/_UIElements/Icon';

const FieldContainerStyled = styled.div<{ appendLight?: boolean }>`
  margin-bottom: 1rem;

  .error {
    color: ${V.color.cerise};
    margin-top: 0.2rem;
  }

  .field {
    position: relative;
  }

  .append {
    position: absolute;
    right: 0px;
    bottom: 0px;
    background-color: ${props => (props.appendLight ? V.color.backSoftest : V.color.cornflower)};
    color: ${props => (props.appendLight ? V.color.frontSofter : V.color.front)};
    padding: 7px;
    padding-left: 15px;
    padding-right: 15px;

    font-size: 22px;
    border-left: 0;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`;

const Label = styled.label`
  font-size: ${V?.font.p};
  color: ${V.color?.frontOp[50]};
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;

  .icon {
    margin-left: 0.3rem;
  }
`;

interface FieldContainerProps {
  label?: string;
  help?: string;
  append?: string;
  appendLight?: boolean;
}

const FieldContainer: React.FC<FieldContainerProps & FieldHookConfig<string>> = ({
  children,
  label,
  help,
  append,
  appendLight,
  ...props
}) => {
  const [, meta] = useField(props);

  return (
    <FieldContainerStyled appendLight={appendLight}>
      {Boolean(label) && (
        <Label>
          {label}

          {Boolean(help?.length) && (
            <Tippy content={help} arrow>
              <Icon icon={InfoIcon} color="gradient" width={14} height={14} className="icon" />
            </Tippy>
          )}
        </Label>
      )}
      <div className="field">
        {children}
        {Boolean(append) && <span className="append">{append}</span>}
      </div>

      {meta.touched && meta.error && typeof meta.error !== 'object' && (
        <div className="error">{meta.error}</div>
      )}
    </FieldContainerStyled>
  );
};

export default FieldContainer;
