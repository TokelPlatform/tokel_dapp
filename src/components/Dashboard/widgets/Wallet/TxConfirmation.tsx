import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';
import { toSatoshi } from 'satoshi-bitcoin';

import {
  selectCurrenTxTokenTx,
  selectCurrentTxError,
  selectCurrentTxId,
  selectCurrentTxStatus,
} from 'store/selectors';
import { getUnixTimestamp } from 'util/helpers';

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
  from: string;
};

const TxConfirmation = ({
  currency,
  recipient,
  amount,
  from,
}: TxConfirmationProps): ReactElement => {
  const txStatus = useSelector(selectCurrentTxStatus);
  const txId = useSelector(selectCurrentTxId);
  const txError = useSelector(selectCurrentTxError);
  const tokenTx = useSelector(selectCurrenTxTokenTx);

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
          amount={toSatoshi(amount)}
          txid={txId}
          from={[from]}
          recipient={recipient}
          currency={currency}
          timestamp={getUnixTimestamp()}
          tokenTx={tokenTx}
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
