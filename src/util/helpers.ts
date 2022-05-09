import BN from 'bn.js';
import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import getUnixTime from 'date-fns/getUnixTime';

import BigNumObject from 'util/types/BigNum';
import { Config, EXTRACT_IPFS_HASH_REGEX, SATOSHIS, WindowSize } from 'vars/defines';

interface ResponsiveType {
  XL: string;
  L: string;
  M: string;
  S: string;
}

const responsiveFactory = (property: string) =>
  Object.entries(WindowSize).reduce(
    (o, [name, size]) => ({ ...o, [name]: `@media (${property}: ${size}px)` }),
    {}
  ) as ResponsiveType;

export const Responsive = {
  above: responsiveFactory('min-width'),
  below: responsiveFactory('max-width'),
};

export const randomColor = () => `hsla(${(360 * Math.random()).toString()}, 70%, 80%, 1)`;

export const parseBigNumObject = (bnObj: BigNumObject) => {
  if (!bnObj) return new BN(0);

  const bn = new BN(0);
  Object.entries(bnObj).forEach(([propName, propValue]) => {
    bn[propName] = propValue;
  });
  return bn;
};

export const processPossibleBN = (value: unknown): string => {
  if (!value) {
    return '0';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  try {
    const bigNum = parseBigNumObject(value as BigNumObject);
    return bigNum.toString(10);
  } catch {
    return value.toString();
  }
};

// IPFS
export const extractIPFSHash = (url: string): string | null => {
  if (!url) return null;
  const ipfsUrlMatch = url.match(EXTRACT_IPFS_HASH_REGEX);
  if (ipfsUrlMatch) {
    return ipfsUrlMatch[1];
  }
  return null;
};

// Number().toString() to cut down unnecessary trailing 0s
export const formatDec = (num: number) => {
  return num.toFixed(Config.DECIMAL);
};

export const toBitcoinAmount = (amountInSatoshi: string): string => {
  const bnAmountInSatoshi = new BN(amountInSatoshi);
  const bnSatoshis = new BN(SATOSHIS);
  let value;

  if (bnAmountInSatoshi.lt(bnSatoshis)) {
    value = parseInt(amountInSatoshi, 10) / SATOSHIS;
    value = Number(value.toFixed(Config.DECIMAL)).toString();
  } else {
    value = bnAmountInSatoshi.div(bnSatoshis).toNumber(); // Okay to do toNumber as we're dealing with TKL and not satoshis

    value = parseFloat(
      `${value.toString()}.${bnAmountInSatoshi
        .toNumber()
        .toString()
        .substring(value.toString().length)}`
    );
  }

  return value;
};

export const getUsdValue = (amountInSatoshi: string, tokelPriceUSD: number) =>
  (parseInt(toBitcoinAmount(amountInSatoshi), 10) * tokelPriceUSD).toFixed(2);

export const formatFiat = (num: number) => {
  return num.toFixed(Config.DECIMAL_FIAT);
};

export const limitLength = (value: string, len: number) => value.substr(0, len);

export const isAddressValid = (address: string) => /^[a-km-zA-HJ-NP-Z1-9]{26,35}$/.test(address);

export const stringifyAddresses = addresses => {
  if (!addresses || !addresses.length) {
    return null;
  }
  if (!Array.isArray(addresses)) {
    return addresses;
  }
  if (addresses.length === 1) {
    return addresses[0];
  }
  if (addresses.length === 2) {
    return `${addresses[0]}, ${addresses[1]}`;
  }
  return `${addresses[0]}, ${addresses[1]} , ${addresses.length - 2} addresses`;
};

export const getUnixTimestamp = (d = null) => {
  const date = d || new Date();
  return getUnixTime(date);
};

export const formatDate = timestamp => format(fromUnixTime(timestamp), 'dd/MM/yyyy H:mm:ss');

export const splitArrayInChunks = <T>(array: Array<T>, chunkSize: number): Array<Array<T>> =>
  Array(Math.ceil(array.length / chunkSize))
    .fill(undefined)
    .map((_, index) => array.slice(index * chunkSize, index * chunkSize + chunkSize));
