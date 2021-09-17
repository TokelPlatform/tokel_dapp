import React, { ReactElement } from 'react';

import styled from '@emotion/styled';

import link from 'assets/link.svg';
import { limitLength, stringifyAddresses } from 'util/helpers';
import links from 'util/links';
import { Colors, INFORMATION_N_A } from 'vars/defines';

import CloseModalButton from 'components/_General/CloseButton';
import CopyToClipboard from 'components/_General/CopyToClipboard';
import TxConfirmationRow from './TxConfirmationRow';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 4px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 2px;
`;

type TxConfirmationProps = {
  currency?: string;
  recipient: string;
  amount: string;
  // usdValue?: number;
  txid: string;
  from: Array<string> | string;
  time: string;
};

const TxInformation = ({
  currency,
  amount,
  txid,
  from,
  time,
  recipient,
}: TxConfirmationProps): ReactElement => {
  // const usdValueTemp = formatFiat(Number(amount) * Number(usdValue));
  return (
    <Column className="wrp">
      <TxConfirmationRow label="From" value={from ? stringifyAddresses(from) : INFORMATION_N_A} />
      <TxConfirmationRow label="To" value={stringifyAddresses(recipient) ?? INFORMATION_N_A} />
      <Row>
        <TxConfirmationRow label="Date and time" value={time ?? INFORMATION_N_A} />
        <TxConfirmationRow label="Amount" value={`${amount} TKL`} />
      </Row>

      <Row>
        {/*
        https://github.com/TokelPlatform/tokel_app/issues/67
        <TxConfirmationRow label="Value (then)" value={`≈ $ ${usdValueTemp}`} />
        <TxConfirmationRow label="Value (now)" value={`≈ $ ${usdValueTemp}`} /> */}
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
      <CloseModalButton />
    </Column>
  );
};

TxInformation.defaultProps = {
  // usdValue: 100,
  currency: 'KMD',
};
export default TxInformation;
