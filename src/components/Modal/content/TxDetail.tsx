import React from 'react';
import { useSelector } from 'react-redux';

import { selectChosenTransaction } from 'store/selectors';

import TxInformation from 'components/Dashboard/widgets/Wallet/TxInformation';
import { processPossibleBN } from 'util/helpers';

const TxDetail = () => {
  const chosenTx = useSelector(selectChosenTransaction);
  return (
    <TxInformation
      recipient={chosenTx.recipient}
      amountInSatoshi={processPossibleBN(chosenTx.value)}
      txid={chosenTx.txid}
      from={chosenTx.from}
      timestamp={chosenTx.timestamp}
    />
  );
};

export default TxDetail;
