import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import link from 'assets/link.svg';
import { dispatch } from 'store/rematch';
import { selectAccountAddress, selectCurrentTxId, selectCurrentTxStatus } from 'store/selectors';
import { formatFiat, limitLength } from 'util/helpers';
import links from 'util/links';

import { Button } from 'components/_General/buttons';
import CopyToClipboard from 'components/_General/CopyToClipboard';
import ErrorMessage from 'components/_General/ErrorMessage';
import { GrayLabel } from '../common';
import TxConfirmationRow from './TxConfirmationRow';

const TxConfirmationRoot = styled.div`
  height: 340px;
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

  const [currentTxId, setCurrentTxId] = useState(null);

  console.log('TX STATUS ', txStatus);
  console.log(txid);

  if (txStatus === 1) {
    setCurrentTxId(limitLength(txid, 36).concat('...'));
    console.log('currentTxId', currentTxId);
    // dispatch.wallet.SET_CURRENT_TX_ID(null);
    dispatch.wallet.SET_CURRENT_TX_STATUS(0);
  }
  const usdValueTemp = formatFiat(Number(amount) * Number(usdValue));
  return (
    <TxConfirmationRoot>
      {!currentTxId && txStatus === 0 && (
        <div style={{ textAlign: 'center' }}>
          <h2>Your transaction is being broadcasted</h2>
          <GrayLabel>Please allow up to a minute for the broadcast to come through.</GrayLabel>
        </div>
      )}
      {!currentTxId && txStatus < 0 && (
        <div>
          <ErrorMessage>
            Error in sending your transaction. <br />
            <br /> Please try again later.
          </ErrorMessage>
        </div>
      )}
      {currentTxId && (
        <Column className="wrp">
          <TxConfirmationRow label="From" value={address} />
          <TxConfirmationRow label="To" value={recepient} />

          <Row>
            <TxConfirmationRow label="Amount" value={amount} />
            <TxConfirmationRow label="Value (then)" value={'≈ '.concat(usdValueTemp)} />
            <TxConfirmationRow label="Value (now)" value={'≈ '.concat(usdValueTemp)} />
          </Row>
          <Column>
            <TxConfirmationRow label="TX id" value={currentTxId}>
              <CopyToClipboard textToCopy={txid} />
              <a
                href={links.explorers[currency].concat('/tx/', currentTxId)}
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
              theme="gray"
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
