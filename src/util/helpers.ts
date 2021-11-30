import format from 'date-fns/format';
import fromUnixTime from 'date-fns/fromUnixTime';
import getUnixTime from 'date-fns/getUnixTime';
import { toBitcoin } from 'satoshi-bitcoin';

import { Config, WindowSize } from 'vars/defines';

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

// Number().toString() to cut down unnecessary trailing 0s
export const formatDec = (num: number) => {
  return Number(num.toFixed(Config.DECIMAL)).toString();
};

export const toBitcoinAmount = (amount: number | string): string => {
  const value = toBitcoin(String(amount));
  return Number(value.toFixed(Config.DECIMAL)).toString();
};

export const getUsdValue = (amountInSatoshi: number, tokelPriceUSD: number) =>
  (toBitcoin(amountInSatoshi) * tokelPriceUSD).toFixed(2);

export const formatFiat = (num: number) => {
  return Number(num.toFixed(Config.DECIMAL_FIAT)).toString();
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
    .map((_, index) => index * chunkSize)
    .map(begin => array.slice(begin, begin + chunkSize));
