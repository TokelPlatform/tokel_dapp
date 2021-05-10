/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  p {
    margin: 0;
  }
`;

type ValueRowProps = {
  keyProp: string;
  value: string;
};

const ValueRow = ({ keyProp, value }: ValueRowProps): ReactElement => {
  return (
    <Row>
      <p>{keyProp}</p>
      <p>{value}</p>
    </Row>
  );
};

export default ValueRow;
