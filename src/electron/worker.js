const { parentPort } = require('worker_threads');
const sb = require('satoshi-bitcoin');

const {
  ECPair,
  ccutils,
  general,
  networks,
  nspvConnect,
  cctokensv2,
} = require('@tokel/bitgo-komodo-cc-lib');

const BitgoAction = {
  RECONNECT: 'reconnect',
  NEW_ADDRESS: 'new_address',
  LOGIN: 'login',
  LOGOUT: 'logout',
  LIST_UNSPENT: 'list_unspent',
  LIST_TRANSACTIONS: 'list_transactions',
  SPEND: 'spend',
  BROADCAST: 'broadcast',
  TOKEN_V2_ADDRESS: 'token_v2_address',
  TOKEN_V2_INFO_TOKEL: 'token_v2_info_tokel',
};

const SATOSHIS = 100000000;
const network = networks.tkltest;

class BitgoSingleton {
  constructor() {
    this.network = network;
  }

  // eslint-disable-next-line class-methods-use-this
  async [BitgoAction.RECONNECT]() {
    if (process.env.NODE_ENV === 'test') {
      return 'singleton created';
    }
    try {
      this.peers = await nspvConnect({ network }, {});
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  // cleanup() {
  //   this.peers.close();
  // }

  // get() {
  //   return this.peers;
  // }

  /**
   * Identifying key can WIF or SEED generated on creating the address
   * @param {string} key
   *
   * Sample response
   *
   * {
   *    address: "RVK1UNQtkcwZ2yJLBQXqEPbjDHrHhHCUeh"
   *    pubkey: "0376094fff1d654f441f82bca9c95bfd03d381e05491aca814d"
   *    result: "success"
   *  }
   */
  async [BitgoAction.LOGIN]({ key }) {
    console.log(key);
    try {
      this.wif = general.keyToWif(key, this.network);
      const keyPair = ECPair.fromWIF(this.wif, this.network);
      this.address = keyPair.getAddress();
      this.pubkeyBuffer = keyPair.getPublicKeyBuffer();
      this.pubkey = this.pubkeyBuffer.toString('hex');
      return {
        wif: this.wif,
        address: this.address,
        pubkey: this.pubkey,
        result: 'success',
      };
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  async [BitgoAction.LOGOUT]() {
    this.wif = null;
    this.address = null;
    this.pubkey = null;
  }

  /**
   * Returns a newly generated address
   *
    return {
      address: 'RJfjdEYQPzbKtENYqRsJF6qpkhVrwGwZxU',
      pubkey: '0376094fff1d654f441f82bca9c95bfd03d381e05491aca814d',
      seed: 'spring stand agree true spring stand agree true spring stand agree true',
      wif: 'Uq6Hy34eqi3W35q8qY8BGqTp8Lr2WWAjcFftJ2YfvBh5UseskYUM',
    };
  */
  async [BitgoAction.NEW_ADDRESS]() {
    const seed = general.getSeedPhrase(256);
    const wif = general.keyToWif(seed, this.network);
    const keyPair = ECPair.fromWIF(wif, this.network);
    return {
      address: keyPair.getAddress(),
      pubkey: keyPair.getPublicKeyBuffer().toString('hex'),
      seed,
      wif,
    };
  }

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
  async [BitgoAction.LIST_UNSPENT]({ address }) {
    if (!this.peers || this.peers.length === 0) {
      throw new Error('Not connected');
    }
    const response = await ccutils.getNormalUtxos(this.peers, address, 0, 0);
    const ccUtxos = await cctokensv2.getTokensForPubkey(
      this.network,
      this.peers,
      this.pubkeyBuffer,
      0,
      0
    );
    const res = {};
    ccUtxos.forEach(utxo => {
      console.log(utxo);
      const id = utxo.tokendata.tokenid.reverse().toString('hex');
      res[id] = utxo.satoshis;
    });
    return {
      height: response.nodeheight,
      skipcount: response.skipcount,
      filter: response.filter,
      balance: response.total / SATOSHIS,
      numutxos: response.utxos.length,
      address: this.address,
      tokens: res,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async [BitgoAction.TOKEN_V2_INFO_TOKEL]({ tokenId }) {
    try {
      const token = await cctokensv2.tokenInfoV2Tokel(this.network, this.peers, this.wif, tokenId);
      return token;
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async [BitgoAction.LIST_TRANSACTIONS]({ address, skipCount = 0 }) {
    if (!this.peers) {
      throw new Error('Not connected');
    }
    const txIds = await ccutils.getTxids(this.peers, address, 0, skipCount, 30);
    const ids = txIds.txids.map(tx => tx.txid.reverse().toString('hex'));
    const uniqueIds = ids.filter((x, y) => ids.indexOf(x) === y);
    return ccutils.getTransactionsManyDecoded(
      this.peers,
      this.network,
      this.pubkeyBuffer,
      uniqueIds
    );
  }

  // eslint-disable-next-line class-methods-use-this
  async [BitgoAction.BROADCASH]({ txHex }) {
    if (!this.peers || this.peers.length === 0) {
      throw new Error('Not connected');
    }
    return new Promise((resolve, reject) => {
      this.peers.nspvBroadcast(
        '0000000000000000000000000000000000000000000000000000000000000000',
        txHex,
        { numPeers: 8 },
        (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        }
      );
    });
  }

  // eslint-disable-next-line class-methods-use-this
  // eslint-disable-next-line consistent-return
  async [BitgoAction.SPEND]({ address, amount }) {
    if (!this.peers || this.peers.length === 0) {
      throw new Error('Not connected');
    }
    const txHex = await general.create_normaltx(
      this.wif,
      address,
      sb.toSatoshi(Number(amount)),
      this.network,
      this.peers
    );
    const txResult = await this.broadcast(txHex);
    return {
      ...txResult,
      address,
      amount,
    };
  }
}

const bitgo = new BitgoSingleton();

parentPort.on('message', msg => {
  console.group('BITGO (WORKER)');
  console.log(msg);
  console.groupEnd();
  return bitgo[msg.type](msg.payload)
    .then(data => {
      if (data) {
        return parentPort.postMessage({ type: msg.type, data });
      }
      return null;
    })
    .catch(e => {
      return parentPort.postMessage({ type: msg.type, data: null, error: e.message });
    });
});
