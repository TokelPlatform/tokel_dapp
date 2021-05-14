import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import link from 'assets/link.svg';
import { dispatch } from 'store/rematch';
import { formatFiat, limitLength } from 'util/helpers';
import links from 'util/links';
import { Colors, SEE_EXPLORER } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import CopyToClipboard from 'components/_General/CopyToClipboard';
import TxConfirmationRow from './TxConfirmationRow';

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
  usdValue?: number;
  txid: string;
  address: string;
  received: boolean;
};

const TxInformation = ({
  currency,
  recepient,
  amount,
  usdValue,
  txid,
  address,
  received,
}: TxConfirmationProps): ReactElement => {
  const usdValueTemp = formatFiat(Number(amount) * Number(usdValue));
  return (
    <Column className="wrp">
      <TxConfirmationRow label="From" value={received ? `${address} (me)` : SEE_EXPLORER} />
      <TxConfirmationRow label="To" value={received ? SEE_EXPLORER : `${address} (me)`} />

      <Row>
        <TxConfirmationRow label="Amount" value={amount} />
        <TxConfirmationRow label="Value (then)" value={`≈ $ ${usdValueTemp}`} />
        <TxConfirmationRow label="Value (now)" value={`≈ $ ${usdValueTemp}`} />
      </Row>
      <Column>
        <TxConfirmationRow label="TX id" value={`${limitLength(txid, 36)} ...`}>
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
  );
};

TxInformation.defaultProps = {
  usdValue: 100,
  currency: 'KMD',
};
export default TxInformation;
