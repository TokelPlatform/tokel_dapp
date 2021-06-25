import got from 'got';

const INSIGHT_SERVER = `https://kmd.explorer.dexstats.info/insight-api-komodo`;

const getTransactionDetail = async txId => {
  try {
    const { body } = await got(`${INSIGHT_SERVER}/tx/${txId}`);
    return JSON.parse(body);
  } catch (e) {
    const error = JSON.parse(e.message);
    throw new Error(error.error);
  }
};

export default getTransactionDetail;
