import React from 'react';
import { FieldHookConfig, FieldArray, useField, Field } from 'formik';
import { Button } from 'components/_General/buttons';
import { Columns, Column } from 'components/_General/Grid';
import styled from '@emotion/styled';

import Icon from 'components/_General/_UIElements/Icon';
import PlusIcon from 'assets/Plus.svg';
import MinusIcon from 'assets/Minus.svg';
import { inputStyles } from './common';

import FieldContainer from './FieldContainer';

const Input = styled(Field)`
  ${inputStyles}
`;

const CustomPaddingColumn = styled(Column)`
  padding-right: 0;
  padding-bottom: 0.15em;
`;

interface MultiKeyValueProps {
  label?: string;
  help?: string;
}

const MultiKeyValue: React.FC<MultiKeyValueProps & FieldHookConfig<string>> = ({
  label,
  help,
  ...props
}) => {
  const [field] = useField(props);

  return (
    <FieldContainer label={label} help={help} {...props}>
      <FieldArray
        name={props.name}
        render={({ push, remove }) => (
          <div>
            {(field.value as unknown as Array<unknown>)?.map((_v, index) => (
              // TODO can I use an id here instead?
              // eslint-disable-next-line react/no-array-index-key
              <Columns mobile key={index}>
                <CustomPaddingColumn size={5}>
                  <Input
                    name={`${props.name}.${index}.key`}
                    placeholder="Attribute name"
                    type="text"
                  />
                </CustomPaddingColumn>
                <CustomPaddingColumn size={5}>
                  <Input
                    name={`${props.name}.${index}.value`}
                    placeholder="Attribute value"
                    type="text"
                  />
                </CustomPaddingColumn>
                <CustomPaddingColumn size={2}>
                  <Button
                    type="button"
                    theme="purple"
                    customWidth="40px"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <Icon icon={MinusIcon} color="front" width={18} height={18} centered />
                  </Button>
                </CustomPaddingColumn>
              </Columns>
            ))}
            <Button
              type="button"
              theme="purple"
              customWidth="110px"
              onClick={() => push({ key: '', value: '' })}
              hasIcon
            >
              <Icon icon={PlusIcon} color="front" width={18} height={18} />
              Add New
            </Button>
          </div>
        )}
      />
    </FieldContainer>
  );
};

export default MultiKeyValue;
