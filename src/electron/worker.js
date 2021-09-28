const { parentPort } = require('worker_threads');
const sb = require('satoshi-bitcoin');

const { ECPair, ccutils, general, networks, nspvConnect } = require('@tokel/bitgo-komodo-cc-lib');

const SATOSHIS = 100000000;
const network = networks.tkltest;
class NspvBitGoSingleton {
  constructor() {
    this.network = network;
    this.connected = false;
  }

  // eslint-disable-next-line class-methods-use-this
  async connect() {
    if (process.env.NODE_ENV === 'test') {
      return 'singleton created';
    }
    try {
      this.peers = await nspvConnect({ network }, {});
      this.connected = true;
      console.log('asdasdas', this.peers);
      return 1;
    } catch (e) {
      this.connected = false;
      console.log('asdasdas', this.peers);
      console.log('Bitgo.connect(): ');
      console.log(e);
      return false;
    }
  }

  cleanup() {
    this.connected = false;
    this.peers.close();
  }

  get() {
    return this.peers;
  }

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
  async login(key) {
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

  logout() {
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
  async getNewAddress() {
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
  async listUnspent(address) {
    if (!this.connected) {
      throw new Error('Not connected');
    }
    const response = await ccutils.getNormalUtxos(this.peers, address, 0, 0);
    const ccUtxos = await ccutils.getCCUtxos(this.peers, address, 0, 0);
    return {
      height: response.nodeheight,
      skipcount: response.skipcount,
      filter: response.filter,
      cc: ccUtxos,
      balance: response.total / SATOSHIS,
      numutxos: response.utxos.length,
      address: this.address,
    };
  }

  async listUnspentTokens(address) {
    if (!this.connected) {
      throw new Error('Not connected');
    }
    const ccUtxos = await ccutils.getCCUtxos(this.peers, address);
    return {
      ...ccUtxos,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async tokenv2infotokel(tokenid) {
    // const token = await getTokenDetail(tokenid);
    // return token;
  }

  // eslint-disable-next-line class-methods-use-this
  async listtransactions(address, skipCount = 0) {
    if (!this.peers) {
      throw new Error('Not connected');
    }
    const txIds = await ccutils.getTxids(this.peers, this.address, 0, skipCount, 30);
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
  async broadcast(txhex) {
    if (!this.connected) {
      throw new Error('Not connected');
    }
    return new Promise((resolve, reject) => {
      this.peers.nspvBroadcast(
        '0000000000000000000000000000000000000000000000000000000000000000',
        txhex,
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
  async spend({ address, amount }) {
    if (!this.connected) {
      throw new Error('Not connected');
    }
    const txhex = await general.create_normaltx(
      this.wif,
      address,
      sb.toSatoshi(Number(amount)),
      this.network,
      this.peers
    );
    const txResult = await this.broadcast(txhex);
    return {
      ...txResult,
      address,
      amount,
    };
  }
}

const bitgo = new NspvBitGoSingleton();

parentPort.on('message', msg => {
  if (['cleanup', 'get'].indexOf(msg.type) !== -1) {
    const data = bitgo[msg.type](msg.payload);
    return parentPort.postMessage({ type: msg.type, data });
  }
  return bitgo[msg.type](msg.payload)
    .then(data => {
      if (data) return parentPort.postMessage({ type: msg.type, data });
      return null;
    })
    .catch(e => {
      return parentPort.postMessage({ type: msg.type, data: null, error: e.message });
    });
});
