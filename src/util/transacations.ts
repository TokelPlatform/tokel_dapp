import { FEE } from 'vars/defines';

export const parseTransactions = txs => {
  const parsedTxs = {};
  txs.forEach(tx => {
    if (!parsedTxs[tx.txid]) {
      parsedTxs[tx.txid] = [];
    }
    parsedTxs[tx.txid].push(tx);
  });
  const resultTxs = [];
  Object.entries(parsedTxs).forEach(k => {
    // it is an outgoing transaction and some change returned to our address
    if (k[1].length > 1) {
      resultTxs.push({
        txid: k[0],
        height: k[1][0].height,
        value: -(k[1][0].value + (k[1][1].value + FEE)),
        received: false,
      });
    } else {
      // it is an incoming transaction, save as is
      resultTxs.push({
        ...k[1][0],
        received: true,
      });
    }
  });
  return resultTxs;
};

export const hello = 'hello';
