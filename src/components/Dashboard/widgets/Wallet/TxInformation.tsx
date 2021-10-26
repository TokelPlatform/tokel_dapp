import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { DEFAULT_NULL_MODAL } from 'store/models/environment';
import { dispatch } from 'store/rematch';
import { selectCurrenTxTokenTx, selectCurrentTokenInfo } from 'store/selectors';
import { formatDate, limitLength, stringifyAddresses } from 'util/helpers';
import links from 'util/links';
import { Colors, INFORMATION_N_A } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import CopyToClipboard from 'components/_General/CopyToClipboard';
import OpenInExplorer from 'components/_General/OpenInExplorer';
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
  overflow-x: auto;
`;

const CloseButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0 1rem 0;
`;

type TxConfirmationProps = {
  currency?: string;
  recipient: string;
  amount: string;
  txid: string;
  from: Array<string> | string;
  timestamp: number;
};

const closeModal = () => dispatch.environment.SET_MODAL(DEFAULT_NULL_MODAL);

const TxInformation = ({
  currency,
  amount,
  txid,
  from,
  timestamp,
  recipient,
}: TxConfirmationProps): ReactElement => {
  const tokenTx = useSelector(selectCurrenTxTokenTx);
  const currentToken = useSelector(selectCurrentTokenInfo);
  // const usdValueTemp = formatFiat(Number(amount) * Number(usdValue));
  return (
    <Column className="wrp">
      <TxConfirmationRow label="From" value={from ? stringifyAddresses(from) : INFORMATION_N_A} />
      <TxConfirmationRow label="To" value={stringifyAddresses(recipient) ?? INFORMATION_N_A} />
      <Row>
        <TxConfirmationRow label="Date and time" value={formatDate(timestamp) ?? INFORMATION_N_A} />
        {tokenTx ? (
          <TxConfirmationRow label="Token" value={`${amount} ${currentToken.name}`} />
        ) : (
          <TxConfirmationRow label="Amount" value={`${amount} TKL`} />
        )}
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
          <OpenInExplorer link={`${links.explorers[currency]}/tx/${txid}`} />
        </TxConfirmationRow>
      </Column>
      <CloseButtonWrapper>
        <Button customWidth="180px" onClick={closeModal} theme={Colors.TRANSPARENT}>
          Close
        </Button>
      </CloseButtonWrapper>
    </Column>
  );
};

export default TxInformation;
