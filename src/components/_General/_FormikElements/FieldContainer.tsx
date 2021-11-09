import React from 'react';
import styled from '@emotion/styled';
import Tippy from '@tippyjs/react';
import InfoIcon from 'assets/HelperInfoCircle.svg';
import { FieldHookConfig, useField } from 'formik';

const FieldContainerStyled = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: ${props => props.theme?.font.p};
  color: ${props => props.theme.color?.frontOp[50]};
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
`;

interface FieldContainerProps {
  label?: string;
  help?: string;
}

const FieldContainer: React.FC<FieldContainerProps & FieldHookConfig<string>> = ({
  children,
  label,
  help,
  ...props
}) => {
  const [, meta] = useField(props);

  return (
    <FieldContainerStyled>
      {!!label && (
        <Label>
          {label}

          {!!help?.length && (
            <Tippy content={help} arrow>
              <img src={InfoIcon} alt="info" />
            </Tippy>
          )}
        </Label>
      )}
      {children}
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </FieldContainerStyled>
  );
};

FieldContainer.defaultProps = {};

export default FieldContainer;
