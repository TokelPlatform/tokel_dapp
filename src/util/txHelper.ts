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
