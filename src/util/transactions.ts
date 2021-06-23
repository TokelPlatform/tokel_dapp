import { FEE, TICKER, USD_VALUE } from 'vars/defines';

/**
 * Parse one transaction
 * @param tx
 * @returns
 */
export const parseTx = tx => {
  // it is an outgoing transaction and some change returned to our address
  if (tx[1][0].height === 'TBA') {
    return tx[1][0];
  }
  if (tx[1].length === 2) {
    return [
      {
        txid: tx[0],
        height: tx[1][0].height,
        value: -(tx[1][0].value + (tx[1][1].value + FEE)),
        received: false,
        recipient: 'See tx at the explorer for details',
      },
    ];
  }
  // sending to yourself
  if (tx[1].length === 3) {
    return [
      {
        ...tx[1][0],
        received: true,
      },
      {
        ...tx[1][0],
        received: false,
        recipient: 'See tx at the explorer for details',
      },
    ];
  }
  // it is an incoming transaction, save as is
  return [
    {
      ...tx[1][0],
      value: Math.abs(tx[1][0].value),
      received: true,
    },
  ];
};

/**
 *
 * @param txs listtransactions rpc output
 * @returns
 */
export const parseTransactions = txs => {
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
  const resultTxs = [];
  Object.entries(parsedTxs).forEach(k => resultTxs.push(...parseTx(k)));
  return resultTxs;
};

/**
 * Parse spend rpc output
 * @param tx spend.tx
 * @returns
 */
export const parseSpendTx = newtx => {
  return {
    received: false,
    unconfirmed: true,
    txid: newtx.tx.txid,
    height: newtx.tx.height ?? 'TBA',
    value: Number(newtx.tx.total) - Number(newtx.tx.change) - FEE,
    recipient: newtx.recipient,
  };
};

// retcode < 0 .. error, === 1 success
export const spendSuccess = broadcasted => broadcasted.retcode === 1;
/**
 * Parse listunspent output
 * @param unspent
 * @returns
 */
export const parseUnspent = unspent => {
  return [
    {
      name: TICKER,
      ticker: TICKER,
      balance: unspent.balance,
      usd_value: USD_VALUE,
    },
  ];
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
  return unconfirmed.filter(txid => !newTxs.find(tx => tx.txid === txid.txid));
};
