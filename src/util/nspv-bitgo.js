const axios = require('axios');
const {
  ECPair,
  NspvPeerGroup,
  ccutils,
  general,
  kmdMessages,
} = require('../node_modules/@tokel/bitgo-komodo-cc-lib');

const networks = require('./networks');

const SATOSHIS = 100000000;

const defaultPort = 22024;
const staticPeers = ['167.99.114.240:22024', '3.19.194.93:22024'];
const network = networks.tkltest;
const params = {
  magic: network.magic,
  defaultPort,
  staticPeers, // dnsSeed works also
  protocolVersion: 170009,
  messages: kmdMessages ? kmdMessages.kmdMessages : [],
};

const opts = {
  numPeers: 8,
  wsOpts: { rejectUnauthorized: false }, // enable self-signed certificates
};

class NspvBitGoSingleton {
  constructor() {
    if (process.env.NODE_ENV === 'test') {
      return 'singleton created';
    }
    this.network = network;
    this.peers = new NspvPeerGroup(params, opts);
    this.peers.on('peer', peer => {
      console.log('peers on: connected to peer', peer.socket.remoteAddress);
    });
    this.connected = false;
    this.peers.connect(() => {
      this.connected = true;
    });
  }

  connect() {
    this.peers.connect();
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
    this.wif = general.keyToWif(key, this.network);
    const keyPair = ECPair.fromWIF(this.wif, this.network);
    this.address = keyPair.getAddress();
    this.pubkey = keyPair.getPublicKeyBuffer().toString('hex');
    return {
      wif: this.wif,
      address: this.address,
      pubkey: this.pubkey,
      result: 'success',
    };
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
    try {
      const response = await ccutils.getNormalUtxos(this.peers, address);
      const ccUtxos = await ccutils.getCCUtxos(this.peers, address);
      return {
        height: response.height,
        skipcount: response.skipcount,
        filter: response.filter,
        lastpeer: response.lastpeer,
        cc: ccUtxos,
        balance: response.total / SATOSHIS,
        numutxos: response.utxos.length,
        address: this.address,
      };
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  async listUnspentTokens(address) {
    try {
      const ccUtxos = await ccutils.getCCUtxos(this.peers, address);
      return {
        ...ccUtxos,
      };
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async tokenv2infotokel(tokenid) {
    try {
      // const token = await getTokenDetail(tokenid);
      // return token;
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async listtransactions(address) {
    try {
      const url = `https://tkltest.explorer.dexstats.info/insight-api-komodo/txs?address=${address}`;
      const resp = await axios(url);
      return resp.data;
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async spend(address, amount) {
    const tx = await general.create_normaltx(this.wif, address, amount * 100000000);
    return tx;
  }

  // eslint-disable-next-line class-methods-use-this
  async broadcast(txhex) {
    return null;
  }

  registerCallback(callbackFn) {
    this.callbackFn = callbackFn;
  }

  cleanup() {
    this.peers.close();
  }
}

const nspv = new NspvBitGoSingleton();
module.exports = nspv;
