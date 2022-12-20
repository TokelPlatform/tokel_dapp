/**
 * Value of the transaction is the sum of its VINS minus change
 * @param vins {object} undefined, Array[1], Array[2]
 * [ {
 *      height: 24248,
 *      txid: 'd0d04323b825c5fe78fc33da512cf6fcb6858d3ff5c18426a758f86f9bf24afa',
 *      value: -3,
 *      vin: 0,
 *    },
 *    {
 *      height: 24248,
 *      txid: 'd0d04323b825c5fe78fc33da512cf6fcb6858d3ff5c18426a758f86f9bf24afa',
 *      value: 1.9999,
 *      vin: 1,
 *    }
 *  ]
 * @param change {integer, float}
 * @returns
 */
export const getTxValue = (vins, change) =>
  vins.reduce((sum, curr) => {
    return sum + Math.abs(curr.value);
  }, 0) - change.value;

/**
 * Groups transactions from listtransactions output by txids
 * @param txs     listtransactions.txids
 * @returns
 */
export const groupTransactions = txs => {
  if (!txs.length) {
    return [];
  }
  const parsedTxs = {};
  // @todo change later
  // we only show 3 top transactions at the moment so we dont need to parse everything now
  txs.sort((a, b) => b.height - a.height);
  txs.slice(0, 9).forEach(tx => {
    if (!parsedTxs[tx.txid]) {
      parsedTxs[tx.txid] = [];
    }
    parsedTxs[tx.txid].push(tx);
  });
  return parsedTxs;
};

/**
 * Filter out the transactions which are still not confirmed in the new incoming tx batch
 * @param txs new incomings txs
 * @param unconfirmed current unconfirmed txs saved in the state
 * @returns
 */
export const getStillUnconfirmed = (newTxs, currentTxs) => {
  if (!currentTxs || currentTxs.length === 0) {
    return [];
  }
  const unconfirmed = currentTxs.filter(tx => tx.unconfirmed);
  return unconfirmed.filter(txid => {
    return !newTxs.find(
      tx =>
        // first comparison is for data returned by the insight API,
        // second comparison is for data returned by nspv
        tx.txid === txid.txid || (tx[0] && tx[0].txid === txid.txid)
    );
  });
};

// retcode < 0 .. error, === 1 success
export const spendSuccess = broadcasted => Number(broadcasted?.retcode) === 1;

export const isTheSameTx = (tx1, tx2) =>
  tx1 &&
  tx2 &&
  tx1.length === 1 &&
  tx2.length === 1 &&
  tx1[0].value === tx2[0].value &&
  tx1[0].height === tx2[0].height &&
  tx1[0].txid === tx2[0].txid;

export const getVins = tx => tx.filter(t => !t.vout && t.vout !== 0);
export const getVouts = tx => tx.filter(t => !t.vout && t.vout !== 0);

export const getRecepients = tx => tx.vout.map(vout => vout.scriptPubKey.addresses).flat();

export const getSenders = tx => [...new Set(tx.vin.map(v => v.addr).flat())];

export const getUniqueTransactionsFromIncoming = (txs, newTxs) => {
  // @todo replace with better algorithm, this one is n^2, aka slow af
  if (!newTxs && newTxs.length === 0) {
    return txs;
  }
  const uniqueTxs = newTxs.filter(newTx => {
    const existingTx = txs.find(oneTx => oneTx.txid === newTx.txid);
    return !existingTx;
  });
  return uniqueTxs;
};
