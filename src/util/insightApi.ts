import axios from 'axios';

const INSIGHT_SERVER = `https://kmd.explorer.dexstats.info/insight-api-komodo`;

const http404 = 'Request failed with status code 404';

const getTransactionDetail = async (txId, txInfo) => {
  try {
    const resp = await axios(`${INSIGHT_SERVER}/tx/${txId}`);
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
