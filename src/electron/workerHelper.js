const { ccutils } = require('@tokel/nspv-js');

const BLOCKS_TO_SEARCH = 100000;
const PAGE_LIMIT = 20;

const getUniqueTransactionIds = async (connection, addr, start, end) => {
  console.log('getUniqueTransactionIds: From ', start, ' till ', end);
  const txIds = await ccutils.getTxidsV2(connection, addr, 0, start, end);
  const ids = txIds.txids.map(tx => tx.txid.reverse().toString('hex'));
  return [...new Set(ids)];
};

const getHeights = (endH, currH) => {
  const startHeight = !endH ? currH - BLOCKS_TO_SEARCH : endH - BLOCKS_TO_SEARCH;
  const endHeight = !endH ? currH : endH; // current height
  console.log('From ', startHeight, ' till ', endHeight);
  return {
    start: startHeight,
    end: endHeight,
  };
};

const retrieveMinimumNumberOfTransactions = async (
  conn,
  address,
  endHeight,
  currentHeight,
  txids = [],
  firstTransactionId = null
) => {
  let allIds = txids;
  console.log('running another round');
  let firstTx = firstTransactionId;
  if (!firstTx) {
    firstTx = await ccutils.getTxids(conn, address, 0, 0);
    console.log('first on ', firstTx.txids[0].txid.toString('hex'));
  }
  console.log('allIds ', allIds);
  if (allIds.length > PAGE_LIMIT || allIds.find(i => i === firstTx)) {
    return allIds;
  }

  const heights = getHeights(endHeight, currentHeight);
  const uniqueIds = await getUniqueTransactionIds(conn, address, heights.start, heights.end);
  allIds = allIds.concat(uniqueIds);
  allIds = [...new Set(allIds)];
  return retrieveMinimumNumberOfTransactions(conn, address, null, heights.start, allIds, firstTx);
};

module.exports = {
  getUniqueTransactionIds,
  getHeights,
  retrieveMinimumNumberOfTransactions,
};
