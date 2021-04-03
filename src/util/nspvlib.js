const got = require('got');

const NSPV_SERVER = 'http://127.0.0.1:7771';
const methods = {
  getinfo: 'getinfo',
  getnewaddress: 'getnewaddress',
  listunspent: 'listunspent',
  login: 'login',
};

/**
 * Returns a newly generated address
 */
export const getnewaddress = () => {
  // returns test data at the moment not to create too many wallets
  // return {
  //   address: 'RJfjdEYQPzbKtENYqRsJF6qpkhVrwGwZxU',
  //   compressed: 1,
  //   pubkey:
  //     '0376094fff1d654f441f82b2a73e1a5769fd67ca9c95bfd03d381e05491aca814d',
  //   seed:
  //     '1484 1333 615 1854 1035 383 766 506 782 124 317 2040 788 405 1132 2014 1727 258 393 17 748 1111 1920',
  //   wif: 'Uq6Hy34eqi3W35q8qY8BGqTp8Lr2WWAjcFftJ2YfvBh5UseskYUM',
  //   wifprefix: 188,
  // };
  return (async () => {
    const { body } = await got.post('http://127.0.0.1:7771', {
      json: {
        jsonrpc: '2.0',
        id: 'curltest',
        method: methods.getnewaddress,
        params: [],
      },
      responseType: 'json',
    });
    return body;
  })();
};

/**
 * Identifying key can WIF or SEED generated on creating the address
 * @param {string} key
 *
 * Sample response
 *
 * {
 *    address: "RVK1UNQtkcwZ2yJLBQXqEPbjDHrHhHCUeh"
 *    compressed: 0
 *    pubkey: "038db9c6b1dd82536b929abec5363fdfa49946b8a7d068f10f6d4b5d12d3033434"
 *    result: "success"
 *    status: "wif will expire in 777 seconds"
 *    wifprefix: 0
 *  }
 */

export const login = async (key) => {
  const { body } = await got.post(NSPV_SERVER, {
    json: {
      jsonrpc: '2.0',
      method: methods.login,
      params: [key],
    },
    responseType: 'json',
  });
  if (body.result === 'success') {
    return body;
  }
  throw new Error('Incorrect login details');
};

/**
 *
 * @param {string} address
 *
 * Sample response
 * {
 *
 *  "result" : success,
 *  "utxos" : [
 *      {
 *          "height" : 2241305,
 *          "txid" : 4e7b86eb846e593ca4e2130fa92af08ad7fcf541850684d64758855daef7fb4a,
 *          "vout" : 0,
 *          "value" : 1,
 *          "rewards" : 0
 *      }
 *  ],
 *  "address" : RKagfH9Fjcm2ddaDRcc3FfmrAViBzApXfp,
 *  "isCC" : 0,
 *  "height" : 2296137,
 *  "numutxos" : 1,
 *  "balance" : 1,
 *  "rewards" : 0,
 *  "skipcount" : 0,
 *  "filter" : 0,
 *  "lastpeer" : 136.243.58.134:7770
 * }
 */
export const listnunspent = async () => {
  console.log('Calling listunspent');
  const { body } = await got.post(NSPV_SERVER, {
    json: {
      jsonrpc: '2.0',
      method: methods.listunspent,
      params: [],
    },
    responseType: 'json',
  });
  if (body.result === 'success') {
    console.log('Returning response');
    return body;
  }
  console.log(body);
  throw new Error('Incorrect login details');
};

export const hello = () => 'hello';
