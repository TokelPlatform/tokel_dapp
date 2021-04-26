import React, { ReactChild, ReactChildren, ReactElement } from 'react';

import styled from '@emotion/styled';

import { GrayLabel, HSpaceMed, VSpaceMed, VSpaceSmall } from '../common';

const Value = styled.p`
  margin: 4px 0 16px 0;
  display: flex;
  flex-direction: row;
`;

const ColumnRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 8px;
`;

type TxConfirmationProps = {
  label: string;
  value: string;
  children?: ReactChild | ReactChildren;
};

const TxConfirmationRow = ({ label, value, children }: TxConfirmationProps): ReactElement => {
  return (
    <ColumnRoot>
      <GrayLabel>{label}</GrayLabel>
      <Value>
        {value}
        <HSpaceMed />
        {children}
      </Value>
    </ColumnRoot>
  );
};

TxConfirmationRow.defaultProps = {
  children: null,
};
export default TxConfirmationRow;
