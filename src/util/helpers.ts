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

// eslint-disable-next-line import/prefer-default-export
export const Responsive = {
  above: responsiveFactory('min-width'),
  below: responsiveFactory('max-width'),
};

export const randomColor = () =>
  'hsla('.concat((360 * Math.random()).toString(), ', ', '70%,', '80%,1)');

export const formatDec = num => {
  return num.toFixed(Config.DECIMAL);
};

export const formatFiat = num => {
  return num.toFixed(Config.DECIMAL_FIAT);
};

export const limitLength = (value, len) => value.substr(0, len);

export const isAddressValid = address => /^[a-km-zA-HJ-NP-Z1-9]{26,35}$/.test(address);
