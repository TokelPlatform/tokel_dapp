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
  if (tx[1].length > 1) {
    return {
      txid: tx[0],
      height: tx[1][0].height,
      value: -(tx[1][0].value + (tx[1][1].value + FEE)),
      received: false,
      recepient: 'See tx at the explorer for details',
    };
  }
  // it is an incoming transaction, save as is
  return {
    ...tx[1][0],
    received: true,
  };
};

/**
 *
 * @param txs listtransactions rpc output
 * @returns
 */
export const parseTransactions = txs => {
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
  Object.entries(parsedTxs).forEach(k => resultTxs.push(parseTx(k)));
  return resultTxs;
};

/**
 * Parse spend rpc output
 * @param tx spend.tx
 * @returns
 */
export const parseSpendTx = tx => {
  return {
    received: false,
    txid: tx.txid,
    height: tx.height ? tx.height : 'TBA',
    value: Number(tx.total) - Number(tx.change) - FEE,
    recepient: '',
  };
};

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
export const getStillUnconfirmed = (txs, unconfirmed) =>
  unconfirmed.filter(txid => !txs.find(tx => tx.txid === txid.txid));

/**
 * Combines uncomfirmed transactions with confirmed ones
 * @param txs incoming transactions from listtransactions
 * @param stillUnconfirmed an array of transactions which have not been confirmed yet, cross checked with new incoming txs
 * @param unconfirmed old array of unconfirmed transactions
 * @returns
 */
export const combineTxs = (txs, stillUnconfirmed, unconfirmed) => {
  if (stillUnconfirmed.length === 0) {
    return txs;
  }
  if (stillUnconfirmed.length < unconfirmed.length) {
    return [...unconfirmed.filter(tx => stillUnconfirmed.indexOf(tx.txid) !== -1), ...txs];
  }
  return [...unconfirmed, ...txs];
};
