import React from 'react';
import { useSelector } from 'react-redux';

import { selectAccountAddress, selectChosenTransaction } from 'store/selectors';
import { formatDec } from 'util/helpers';
import { TICKER } from 'vars/defines';

import TxInformation from 'components/Dashboard/widgets/Wallet/TxInformation';

const TxDetail = () => {
  const address = useSelector(selectAccountAddress);
  const chosenTx = useSelector(selectChosenTransaction);
  return (
    <TxInformation
      currency={TICKER}
      recepient={chosenTx.recepient}
      amount={formatDec(chosenTx.value)}
      txid={chosenTx.txid}
      address={address}
      received={chosenTx.received}
    />
  );
  // return <h1>Hello</h1>;
};

export default TxDetail;
