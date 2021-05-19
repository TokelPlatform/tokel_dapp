import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import link from 'assets/link.svg';
import { dispatch } from 'store/rematch';
import {
  selectAccountAddress,
  selectCurrentTxError,
  selectCurrentTxId,
  selectCurrentTxStatus,
} from 'store/selectors';
import { formatFiat, limitLength } from 'util/helpers';
import links from 'util/links';
import { Colors } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import CopyToClipboard from 'components/_General/CopyToClipboard';
import ErrorMessage from 'components/_General/ErrorMessage';
import Spinner from 'components/_General/Spinner';
import { GrayLabel, VSpaceMed } from '../common';
import TxConfirmationRow from './TxConfirmationRow';

const TxConfirmationRoot = styled.div`
  height: var(--modal-content-height);
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 8px;
`;
type TxConfirmationProps = {
  currency?: string;
  recepient: string;
  amount: string;
  usdValue?: string;
};

const TxConfirmation = ({
  currency,
  recepient,
  amount,
  usdValue,
}: TxConfirmationProps): ReactElement => {
  const txid = useSelector(selectCurrentTxId);
  const address = useSelector(selectAccountAddress);
  const txStatus = useSelector(selectCurrentTxStatus);
  const txError = useSelector(selectCurrentTxError);

  const [currentTxId, setCurrentTxId] = useState(null);

  const usdValueTemp = formatFiat(Number(amount) * Number(usdValue));

  useEffect(() => {
    if (txStatus === 1) {
      setCurrentTxId(`${limitLength(txid, 36)}...`);
      dispatch.wallet.SET_CURRENT_TX_STATUS(0);
    }
  }, [txStatus]);

  return (
    <TxConfirmationRoot>
      {!currentTxId && txStatus === 0 && (
        <div style={{ textAlign: 'center' }}>
          <h2>Your transaction is being broadcasted</h2>
          <GrayLabel>Please allow up to a minute for the broadcast to come through.</GrayLabel>
          <VSpaceMed />
          <Spinner bgColor="var(--color-modal-bg)" />
        </div>
      )}
      {!currentTxId && txStatus < 0 && (
        <div>
          <ErrorMessage>
            <p>There was an error with your transaction.</p>
            <br />
            <b>Error</b>
            <p style={{ overflowWrap: 'break-word' }}>{txError}</p>
          </ErrorMessage>
        </div>
      )}
      {currentTxId && (
        <Column className="wrp">
          <TxConfirmationRow label="From" value={address} />
          <TxConfirmationRow label="To" value={recepient} />

          <Row>
            <TxConfirmationRow label="Amount" value={amount} />
            <TxConfirmationRow label="Value (then)" value={`≈ $ ${usdValueTemp}`} />
            <TxConfirmationRow label="Value (now)" value={`≈ $ ${usdValueTemp}`} />
          </Row>
          <Column>
            <TxConfirmationRow label="TX id" value={currentTxId}>
              <CopyToClipboard textToCopy={txid} color={Colors.WHITE} />
              <a
                href={`${links.explorers[currency]}/tx/${txid}`}
                rel="noreferrer"
                target="_blank"
                style={{ marginLeft: '8px' }}
              >
                <img src={link} alt="explorerLink" />
              </a>
            </TxConfirmationRow>
          </Column>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
            <Button
              customWidth="180px"
              onClick={() => dispatch.environment.SET_MODAL(null)}
              theme={Colors.TRANSPARENT}
            >
              Close
            </Button>
          </div>
        </Column>
      )}
    </TxConfirmationRoot>
  );
};

TxConfirmation.defaultProps = {
  usdValue: '100',
  currency: 'KMD',
};
export default TxConfirmation;
