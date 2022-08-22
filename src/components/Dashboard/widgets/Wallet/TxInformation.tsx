import React from 'react';
import { useSelector } from 'react-redux';

import styled from '@emotion/styled';

import { DEFAULT_NULL_MODAL } from 'store/models/environment';
import { dispatch } from 'store/rematch';
import { selectCurrentTokenInfo } from 'store/selectors';
import { formatDate, stringifyAddresses, toBitcoinAmount } from 'util/helpers';
import { Colors, INFORMATION_N_A, TICKER } from 'vars/defines';

import { Button } from 'components/_General/buttons';
import ExplorerLink from 'components/_General/ExplorerLink';
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
  recipient: string;
  amountInSatoshi: string;
  txid: string;
  from: Array<string> | string;
  timestamp: number;
  tokenTx?: boolean;
};

const closeModal = () => dispatch.environment.SET_MODAL(DEFAULT_NULL_MODAL);

const TxInformation = ({
  amountInSatoshi,
  txid,
  from,
  timestamp,
  recipient,
  tokenTx,
}: TxConfirmationProps): React.ReactElement => {
  const currentToken = useSelector(selectCurrentTokenInfo);
  const txAmount = toBitcoinAmount(amountInSatoshi);
  return (
    <Column className="wrp">
      <TxConfirmationRow label="From" value={from ? stringifyAddresses(from) : INFORMATION_N_A} />
      <TxConfirmationRow label="To" value={stringifyAddresses(recipient) ?? INFORMATION_N_A} />
      <Row>
        <TxConfirmationRow label="Date and time" value={formatDate(timestamp) ?? INFORMATION_N_A} />
        {tokenTx ? (
          <TxConfirmationRow label="Token" value={`${txAmount} ${currentToken.name}`} />
        ) : (
          <TxConfirmationRow label="Amount" value={`${txAmount} ${TICKER}`} />
        )}
      </Row>
      <Column>
        <TxConfirmationRow label="Tx id">
          <ExplorerLink txidColor={Colors.WHITE} txid={txid} />
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
