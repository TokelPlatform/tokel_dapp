import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import { selectAccountAddress } from 'store/selectors';

import { Button } from 'components/_General/buttons';
import { GrayLabel } from '../common';

const TxConfirmationRoot = styled.div`
  height: 340px;
`;
const Value = styled.p`
  margin: 8px 0 16px 0;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

const TxConfirmation = (): ReactElement => {
  const address = useSelector(selectAccountAddress);
  return (
    <TxConfirmationRoot>
      <Row>
        <GrayLabel>From</GrayLabel>
        <Value>{address}</Value>
      </Row>
      <Row>
        <GrayLabel>To</GrayLabel>
        <Value>{address}</Value>
      </Row>
      <Row>
        <GrayLabel>Amount</GrayLabel>
        <Value>$1.2323</Value>
      </Row>
      <Row>
        <GrayLabel>TX ID</GrayLabel>
        <Value>80f4603e008a387a08fe2c62a825a026cdcc3968cf709</Value>
      </Row>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          customWidth="180px"
          onClick={() => dispatch.environment.SET_MODAL(null)}
          theme="gray"
        >
          Close
        </Button>
      </div>
    </TxConfirmationRoot>
  );
};

export default TxConfirmation;
