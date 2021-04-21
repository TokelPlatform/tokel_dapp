import { WindowSize } from 'vars/defines';

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
