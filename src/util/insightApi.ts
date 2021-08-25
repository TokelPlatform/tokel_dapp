import axios from 'axios';

import { TICKER } from 'vars/defines';

import links from './links';

const http404 = 'Request failed with status code 404';

const makeReq = async url => axios(`${links.insightApi[TICKER]}/${url}`);

export const getTransactionDetail = async (txId, txInfo) => {
  try {
    const resp = await makeReq(`/tx/${txId}`);
    return resp.data;
  } catch (e) {
    if (e.message && e.message === http404) {
      return txInfo;
    }
    const error = JSON.parse(e.message);
    throw new Error(error.error);
  }
};
/**
 * https://explorer.komodoplatform.com:10000/tokel/api/tokens?cctxid=6735c926a925ba78dfd812ae4179318303ee24435685e7b99d9ecd08f7659267
 * @param tokenid
 * @returns
 */
export const getTokenDetail = async tokenid => {
  try {
    const resp = await makeReq(`/tokens?cctxid=${tokenid}`);
    return resp.data;
  } catch (e) {
    const error = JSON.parse(e.message);
    throw new Error(error.error);
  }
};

/**
 * https://explorer.komodoplatform.com:10000/tokel/api/txs?address=RCiLosxLHCJkQxwrFcFjCry9Tv5MVshSPB
 * @param address
 */
export const getTransactions = async address => {
  const resp = await makeReq(`txs?address=${address}`);
  console.log(resp.data);
  return resp.data;
};

export default getTransactionDetail;
