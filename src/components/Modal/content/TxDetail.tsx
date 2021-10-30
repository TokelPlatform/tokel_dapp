import React from 'react';
import { useSelector } from 'react-redux';

import { selectChosenTransaction } from 'store/selectors';
import { formatDec } from 'util/helpers';
import { TICKER } from 'vars/defines';

import TxInformation from 'components/Dashboard/widgets/Wallet/TxInformation';

const TxDetail = () => {
  const chosenTx = useSelector(selectChosenTransaction);
  return (
    <TxInformation
      currency={TICKER}
      recipient={chosenTx.recipient}
      amount={formatDec(chosenTx.value)}
      txid={chosenTx.txid}
      from={chosenTx.from}
      timestamp={chosenTx.timestamp}
    />
  );
};

export default TxDetail;
