import { toBitcoin } from 'satoshi-bitcoin';

import { FEE, INFORMATION_N_A, TICKER, USD_VALUE } from 'vars/defines';

import { getTransactionDetail } from './insightApi';
import { getRecepients, getSenders, groupTransactions } from './transactionsHelper';

/**
 * Parse one transaction
 * @param tx
 * @returns
 */
export const parseListTxsRpcTx = tx => {
  if (tx.length === 2) {
    return [
      {
        txid: tx[0].txid,
        height: tx[0].height,
        value: -(tx[0].value + (tx[1].value + FEE)),
        received: false,
        recepient: INFORMATION_N_A,
      },
    ];
  }
  // sending to yourself
  if (tx.length === 3) {
    return [
      {
        ...tx[0],
        received: true,
      },
      {
        ...tx[0],
        received: false,
        recepient: INFORMATION_N_A,
      },
    ];
  }
  // it is an incoming transaction, save as is
  return [
    {
      ...tx[0],
      value: Math.abs(tx[0].value),
      received: true,
    },
  ];
};

export const parseBlockchainTransaction = (tx, address: string) => {
  const iAmSender = tx.senders.find(s => s === address);
  return [
    {
      value: toBitcoin(tx.value.toString()),
      from: tx.senders,
      recipient: tx.recepients,
      timestamp: tx.time,
      txid: tx.txid,
      height: tx.blockheight,
      received: !iAmSender,
    },
  ];
};

/**
 * tx samples https://kmd.explorer.dexstats.info/insight-api-komodo/tx/b0fd208b3653ddeced4eabc5af6d3f50442cf0b5d59c34db79b4091b3163d578
 * @param tx        {object}   komodo insight api json object
 * @param address   {string}   current wallet address
 * @returns
 */
export const parseSerializedTransaction = (tx, address) => {
  if (tx.unconfirmed) {
    return tx;
  }
  if (!tx.time) {
    return parseListTxsRpcTx(tx);
  }
  const recipients = getRecepients(tx);
  const senders = getSenders(tx);
  const iAmSender = senders.find(s => s === address);
  return [
    {
      value: Number(tx.vout[0].value),
      from: senders,
      recipient: iAmSender ? recipients : [address],
      timestamp: tx.time,
      txid: tx.txid,
      height: tx.blockheight,
      received: !iAmSender,
    },
  ];
};

/**
 * Parse spend rpc output
 * @param tx spend.tx
 * @returns
 */
export const parseSpendTx = (newtx, from) => {
  return {
    received: false,
    unconfirmed: true,
    txid: newtx.txid,
    // height: newtx.tx.height ?? 'TBA',
    value: newtx.value,
    recipient: newtx.recipient,
    senders: [from],
    timestamp: newtx.time,
    from,
  };
};

/**
 * Parse listunspent output
 * @param unspent
 * @returns
 */
export const parseUnspent = balance => {
  return [
    {
      name: TICKER,
      ticker: TICKER,
      balance,
      usd_value: USD_VALUE,
    },
  ];
};

/**
 * Gets details of all transactions
 * @param txs
 * @returns
 */
export const getAllTransactionDetails = async txs => {
  const grouppedTxs = groupTransactions(txs);
  const txids = Object.keys(grouppedTxs);
  const promises = txids.map(tx => getTransactionDetail(tx, grouppedTxs[tx]));
  return Promise.all(promises);
};
