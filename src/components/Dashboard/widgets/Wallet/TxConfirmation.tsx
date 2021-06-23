import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { dispatch } from 'store/rematch';
import {
  selectAccountAddress,
  selectCurrentTxError,
  selectCurrentTxId,
  selectCurrentTxStatus,
} from 'store/selectors';
import { limitLength } from 'util/helpers';

import ErrorMessage from 'components/_General/ErrorMessage';
import Spinner from 'components/_General/Spinner';
import { GrayLabel, VSpaceMed } from '../common';
import TxInformation from './TxInformation';

const TxConfirmationRoot = styled.div`
  height: var(--modal-content-height);
`;

type TxConfirmationProps = {
  currency?: string;
  recipient: string;
  amount: string;
  // usdValue?: string;
};

const TxConfirmation = ({ currency, recipient, amount }: TxConfirmationProps): ReactElement => {
  const txid = useSelector(selectCurrentTxId);
  const address = useSelector(selectAccountAddress);
  const txStatus = useSelector(selectCurrentTxStatus);
  const txError = useSelector(selectCurrentTxError);

  const [currentTxId, setCurrentTxId] = useState(null);

  // const usdValueTemp = formatFiat(Number(amount) * Number(usdValue));

  useEffect(() => {
    if (txStatus === 1) {
      setCurrentTxId(`${limitLength(txid, 36)}...`);
      dispatch.wallet.SET_CURRENT_TX_STATUS(0);
    }
  }, [txStatus, txid]);

  return (
    <TxConfirmationRoot>
      {!currentTxId && txStatus === 0 && (
        <div style={{ textAlign: 'center' }}>
          <h2>Your transaction is being broadcasted</h2>
          <GrayLabel>Please allow up to a minute for the broadcast to come through.</GrayLabel>
          <GrayLabel>Closing this window will not affect the outcome of the transaction.</GrayLabel>
          <VSpaceMed />
          <Spinner bgColor="var(--color-modal-bg)" />
        </div>
      )}
      {!currentTxId && txStatus < 0 && (
        <div>
          <ErrorMessage>
            <p style={{ overflowWrap: 'break-word' }}>{txError}</p>
          </ErrorMessage>
        </div>
      )}
      {currentTxId && (
        <TxInformation
          amount={amount}
          txid={currentTxId}
          address={address}
          recipient={recipient}
          received={false}
          currency={currency}
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
