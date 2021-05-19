import got from 'got';

import { ErrorMessages } from 'vars/defines';

const NSPV_SERVER = 'http://127.0.0.1:7771';

const Method = {
  BROADCAST: 'broadcast',
  GET_INFO: 'getinfo',
  GET_NEW_ADDRESS: 'getnewaddress',
  LIST_UNSPENT: 'listunspent',
  LIST_TRANSACTIONS: 'listtransactions',
  LOGIN: 'login',
  LOGOUT: 'logout',
  SPEND: 'spend',
};

export const requestNSPV = async (method, params = []) => {
  try {
    const { body } = await got.post(NSPV_SERVER, {
      json: {
        jsonrpc: '2.0',
        id: 'curltest',
        method,
        params,
      },
      responseType: 'json',
    });
    // cannot fail :)
    if (method === Method.GET_NEW_ADDRESS) {
      return body;
    }
    if (body.result === 'success') {
      return body;
    }

    throw new Error(JSON.stringify(body));
  } catch (e) {
    // connection refused ECONNREFUSED
    console.error(e);
    e.message = ErrorMessages.NETWORK_ISSUES;
    throw new Error(e);
  }
};

/**
 * Returns a newly generated address
 *
  return {
    address: 'RJfjdEYQPzbKtENYqRsJF6qpkhVrwGwZxU',
    compressed: 1,
    pubkey:
      '0376094fff1d654f441f82b2a73e1a5769fd67ca9c95bfd03d381e05491aca814d',
    seed:
      '1484 1333 615 1854 1035 383 766 506 782 124 317 2040 788 405 1132 2014 1727 258 393 17 748 1111 1920',
    wif: 'Uq6Hy34eqi3W35q8qY8BGqTp8Lr2WWAjcFftJ2YfvBh5UseskYUM',
    wifprefix: 188,
  };
 */
export const getNewAddress = () => requestNSPV(Method.GET_NEW_ADDRESS);

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
export const login = async key => requestNSPV(Method.LOGIN, [key]);

export const logout = () => requestNSPV(Method.LOGOUT, []);

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
export const listUnspent = async () => requestNSPV(Method.LIST_UNSPENT);

/**
 *
{
  "rewards": "0.00000000",
  "validated": "0.00000000",
  "txfee": "0.00010000",
  "total": "0.79980000",
  "change": "0.69970000",
  "txid": "7d764a62baaadc4abf9a2c378298b545a201f8d521e6af5f890e0955b9bbb820",
  "tx": {
    "nVersion": 4,
    "vin": [
      {
        "txid": "90d78529b1cb62b8125bd90bc6c4a93149fa695702eaf7afcaea0f987074d2ee",
        "vout": 1,
        "scriptSig": "47304402207d73373f5a9eaadfc53397ea80fdae577c7cfaa46f61b6982e24126c3f0ba2ee02205e41dfba0fa34a3b9f2db1e662408fa7d504093e3f573d38cb574bb02610dc6e01",
        "sequenceid": 4294967295
      }
    ],
    "vout": [
      {
        "value": 0.1,
        "scriptPubKey": "76a914710030372eaf07cc7efb45b05037c453cb6e5ce388ac"
      },
      {
        "value": 0.6997,
        "scriptPubKey": "21021398818c99a312ffabccc51f3b4534a1f57ddd1bdc1500dcc3e818014595a5e2ac"
      }
    ],
    "nLockTime": 1619098071,
    "nExpiryHeight": 0,
    "valueBalance": 0
  },
  "result": "success",
  "hex": "0400008085202f8901eed27470980feacaaff7ea025769fa4931a9c4c60bd95b12b862cbb12985d790010000004847304402207d73373f5a9eaadfc53397ea80fdae577c7cfaa46f61b6982e24126c3f0ba2ee02205e41dfba0fa34a3b9f2db1e662408fa7d504093e3f573d38cb574bb02610dc6e01ffffffff0280969800000000001976a914710030372eaf07cc7efb45b05037c453cb6e5ce388ac50a82b04000000002321021398818c99a312ffabccc51f3b4534a1f57ddd1bdc1500dcc3e818014595a5e2acd7798160000000000000000000000000000000",
  "retcodes": [
    -5
  ],
  "lastpeer": "45.32.19.196:7770"
}
 */
export const spend = async (address, amount) => requestNSPV(Method.SPEND, [address, amount]);

export const broadcast = async hex => requestNSPV(Method.BROADCAST, [hex]);

/**
{
  "result": "success",
  "txids": [
    {
      "height": 2367771,
      "txid": "5bea56c439a145ed123ab760c1aa9573d25a5d31d18c10308d05207578e89a11",
      "value": -0.061906,
      "vin": 0
    },
    {
      "height": 2367771,
      "txid": "5bea56c439a145ed123ab760c1aa9573d25a5d31d18c10308d05207578e89a11",
      "value": 0.061396,
      "vout": 1
    }
  ],
  "address": "RKagfH9Fjcm2ddaDRcc3FfmrAViBzApXfp",
  "isCC": 0,
  "height": 2368887,
  "numtxids": 73,
  "skipcount": 0,
  "filter": 0,
  "lastpeer": "45.32.19.196:7770"
}
 */
export const listTransactions = async address => requestNSPV(Method.LIST_TRANSACTIONS, [address]);
