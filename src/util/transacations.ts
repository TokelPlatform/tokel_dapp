import { FEE } from 'vars/defines';

export const parseTx = tx => {
  // it is an outgoing transaction and some change returned to our address
  if (tx[1].length > 1) {
    return {
      txid: tx[0],
      height: tx[1][0].height,
      value: -(tx[1][0].value + (tx[1][1].value + FEE)),
      received: false,
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
 * height
 * txid
 * value
 * received
 */
export const parseTransactions = txs => {
  const parsedTxs = {};
  txs.forEach(tx => {
    if (!parsedTxs[tx.txid]) {
      parsedTxs[tx.txid] = [];
    }
    parsedTxs[tx.txid].push(tx);
  });
  const resultTxs = [];
  Object.entries(parsedTxs).forEach(k => resultTxs.push(parseTx(k)));
  resultTxs.sort((a, b) => b.height - a.height);
  return resultTxs;
};

export const parseSpendTx = tx => {
  return {
    received: false,
    txid: tx.txid,
    height: tx.height ? tx.height : '-',
    value: Number(tx.total) - Number(tx.change) - FEE,
  };
};
