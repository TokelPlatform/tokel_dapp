import { toSatoshi } from 'satoshi-bitcoin';

import { TICKER, USD_VALUE } from 'vars/defines';

import { getUnixTimestamp } from './helpers';
import { TxType } from './nspvlib-mock';

export const parseBlockchainTransaction = (tx, address: string) => {
  const iAmSender = tx.senders.find(s => s === address);
  if (iAmSender) {
    tx.recipients = tx.recipients.filter(addr => addr !== address);
  }
  return {
    value: tx.value,
    from: tx.senders,
    recipient: tx.recipients.length > 0 ? tx.recipients : address,
    timestamp: tx.time,
    txid: tx.txid,
    height: tx.blockheight,
    received: !iAmSender,
  };
};

/**
 * Parse spend rpc output
 * @param tx spend.tx
 * @returns
 */
export const parseSpendTx = (newtx: TxType, from) => {
  return {
    received: false,
    unconfirmed: true,
    txid: newtx.txid,
    // height: newtx.tx.height ?? 'TBA',
    value: toSatoshi(newtx.value.toString()),
    recipient: newtx.recipient,
    senders: [from],
    timestamp: getUnixTimestamp(),
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
