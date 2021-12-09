import React from 'react';
import { useSelector } from 'react-redux';

import { selectChosenTransaction } from 'store/selectors';

import TxInformation from 'components/Dashboard/widgets/Wallet/TxInformation';

const TxDetail = () => {
  const chosenTx = useSelector(selectChosenTransaction);
  return (
    <TxInformation
      recipient={chosenTx.recipient}
      amountInSatoshi={String(chosenTx.value)}
      txid={chosenTx.txid}
      from={chosenTx.from}
      timestamp={chosenTx.timestamp}
    />
  );
};

export default TxDetail;
