import axios from 'axios';

import { TICKER } from 'vars/defines';

import links from './links';

const http404 = 'Request failed with status code 404';

const getTransactionDetail = async (txId, txInfo) => {
  try {
    const resp = await axios(`${links.insightApi[TICKER]}/tx/${txId}`);
    return resp.data;
  } catch (e) {
    if (e.message && e.message === http404) {
      return txInfo;
    }
    const error = JSON.parse(e.message);
    throw new Error(error.error);
  }
};

export default getTransactionDetail;
