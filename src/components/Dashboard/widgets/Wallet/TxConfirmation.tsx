import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import ErrorMessage from 'components/_General/ErrorMessage';
import Spinner from 'components/_General/Spinner';
import { GrayLabel, VSpaceMed } from '../common';
import TxInformation from './TxInformation';

const TxConfirmationRoot = styled.div`
  min-height: var(--modal-content-height);
`;

type TxConfirmationProps = {
  currency?: string;
  recipient: string;
  amount: string;
  txId: string;
  txStatus: number;
  txError: string;
  from: string;
};

const TxConfirmation = ({
  currency,
  recipient,
  amount,
  txId,
  txStatus,
  txError,
  from,
}: TxConfirmationProps): ReactElement => {
  return (
    <TxConfirmationRoot>
      {!txId && txStatus === 0 && (
        <div style={{ textAlign: 'center' }}>
          <h2>Your transaction is being broadcast</h2>
          <GrayLabel>Please allow up to a minute for the broadcast to come through.</GrayLabel>
          <GrayLabel>
            Please do not close the window while transaction is being processed.
          </GrayLabel>
          <VSpaceMed />
          <Spinner bgColor="var(--color-modal-bg)" />
        </div>
      )}
      {!txId && txStatus < 0 && (
        <div>
          <ErrorMessage>
            <p style={{ overflowWrap: 'break-word' }}>{txError}</p>
          </ErrorMessage>
        </div>
      )}
      {txId && (
        <TxInformation
          amount={amount}
          txid={txId}
          from={[from]}
          recipient={recipient}
          currency={currency}
          timestamp={Date.now()}
        />
      )}
    </TxConfirmationRoot>
  );
};

TxConfirmation.defaultProps = {
  // usdValue: '100',
  currency: 'KMD',
};
export default TxConfirmation;
