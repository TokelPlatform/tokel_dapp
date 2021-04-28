export const getNewAddress = async (fail = false) => {
  if (fail) {
    throw new Error('Incorrect login details');
  }
  return {
    address: 'RJfjdEYQPzbKtENYqRsJF6qpkhVrwGwZxU',
    compressed: 1,
    pubkey: '0376094fff1d654f441f82b2a73e1a5769fd67ca9c95bfd03d381e05491aca814d',
    seed:
      '1484 1333 615 1854 1035 383 766 506 782 124 317 2040 788 405 1132 2014 1727 258 393 17 748 1111 1920',
    wif: 'Uq6Hy34eqi3W35q8qY8BGqTp8Lr2WWAjcFftJ2YfvBh5UseskYUM',
    wifprefix: 188,
  };
};

export const login = async (key, fail = false) => {
  console.log(key);
  if (fail) {
    throw new Error('Incorrect login details');
  }
  return {
    address: 'RVK1UNQtkcwZ2yJLBQXqEPbjDHrHhHCUeh',
    compressed: 0,
    pubkey: '038db9c6b1dd82536b929abec5363fdfa49946b8a7d068f10f6d4b5d12d3033434',
    result: 'success',
    status: 'wif will expire in 777 seconds',
    wifprefix: 0,
  };
};

export interface UtxoType {
  height: number;
  txid: string;
  vout: number;
  value: number;
  rewards: number;
}

export interface UnspentType {
  result: string;
  utxos: Array<UtxoType>;
  address: string;
  isCC: number;
  height: number;
  numutxos: number;
  balance: number;
  rewards: number;
  skipcount: number;
  filter: number;
  lastpeer: string;
}

export interface TxType {
  height: number;
  txid: string;
  value: number;
  vin?: number;
  received?: boolean;
  recepient?: string;
}

export const listUnspent = async (fail = false): Promise<UnspentType> => {
  if (fail) {
    throw new Error('Incorrect login details');
  }
  return {
    result: 'success',
    utxos: [
      {
        height: 2241305,
        txid: '4e7b86eb846e593ca4e2130fa92af08ad7fcf541850684d64758855daef7fb4a',
        vout: 0,
        value: 1,
        rewards: 0,
      },
      {
        height: 2241305,
        txid: '4e7b86eb8463393ca4e2130fa92af08ad7fcf541850684d64758855daef7fb4a',
        vout: 1,
        value: 1.23423423,
        rewards: 0.234234234,
      },
      {
        height: 2241305,
        txid: '4e7b86eb846e593f4e2130fa92af08ad7fcf541850684d64758855daef7fb4a',
        vout: 0,
        value: 10.123123,
        rewards: 0,
      },
    ],
    address: 'RKagfH9Fjcm2ddaDRcc3FfmrAViBzApXfp',
    isCC: 0,
    height: 2296137,
    numutxos: 1,
    balance: 1,
    rewards: 0,
    skipcount: 0,
    filter: 0,
    lastpeer: '136.243.58.134:7770',
  };
};
