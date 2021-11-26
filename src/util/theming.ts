import { css } from '@emotion/react';
import { isObject, merge, omit } from 'lodash';

// settings
const ignoredKeys = ['name'];

// themes
const baseTheme = {
  color: {
    cornflower: 'hsla(231, 100%, 69%, 1.0)',
    cornflowerHard: 'hsla(231, 54%, 55%, 1.0)',
    lilac: 'hsla(261, 92%, 64%, 1.0)',
    cerise: 'hsla(336, 100%, 55%, 1.0)',
    slate: 'hsla(211, 20%, 57%, 1.0)',
    danger: 'hsla(340, 80%, 50%, 1.0)',
    growth: 'hsla(128, 65%, 48%, 1.0)',
    highlight: 'hsla(171, 94%, 61%, 1.0)',
    modal: {
      bg: '#212b3b',
    },
    windowControl: {
      close: 'hsla(0, 100%, 65%, 1.0)',
      closeHover: 'hsla(0, 94%, 63%, 1.0)',
      min: 'hsla(44, 100%, 50%, 1.0)',
      minHover: 'hsla(42, 100%, 47%, 1.0)',
      max: 'hsla(127, 100%, 40%, 1.0)',
      maxHover: 'hsla(128, 100%, 35%, 1.0)',
    },
  },
  font: {
    h1: '1.625rem',
    h2: '1.25rem',
    h3: '1.125rem',
    p: '1rem',
    pSmall: '0.875rem',
    pSmaller: '0.75rem',
    pSmallest: '0.5rem',
  },
  size: {
    borderRadius: '4px',
    borderRadiusBig: '8px',
  },
  grid: {
    columnGap: '0.75rem',
  },
};

export const darkTheme = {
  name: 'dark',
  color: {
    back: 'hsla(214, 32%, 18%, 1.0)',
    backSoft: 'hsla(214, 32%, 18%, 1.0)',
    backSofter: 'hsla(218, 23%, 21%, 1.0)',
    backSoftest: 'hsla(212, 22%, 27%, 1.0)',
    backHard: 'hsla(212, 38%, 15%, 1.0)',
    backHarder: 'hsla(211, 33%, 14%, 1.0)',
    front: 'hsla(0, 100%, 100%, 1.0)',
    frontSoft: 'hsla(211, 20%, 57%, 1.0)',
    frontSofter: 'hsla(228, 14%, 83%, 1.0)',
    frontOp: {
      50: 'hsla(0, 100%, 100%, 0.5)',
    },
  },
};

export const lightTheme = {
  name: 'light',
  color: {
    back: '#eee',
    backSoft: '#ddd',
    backSofter: '#ccc',
    backSoftest: '#bbb',
    backHard: '#f1f1f1',
    backHarder: '#fff',
    front: '#111',
    frontSoft: '#333',
    frontSofter: '#555',
    frontOp: {
      50: 'hsla(0, 100%, 5%, 0.5)',
    },
  },
};

// typing
const referenceTheme = omit(merge({}, baseTheme, darkTheme), ignoredKeys);

export const themes = [darkTheme];
export const themeNames = themes.map(t => t.name);

export type Theme = typeof referenceTheme;
export type ThemeName = typeof themeNames[number];
export type ThemeSubset = { [key: string]: string | ThemeSubset };

// build CSS vars recursively for use with emotion
const cssVarPrefix = '-';
const varNameBuilder = (...args: string[]) => args.join('-');

const flattenTheme = (theme: ThemeSubset, prefix: string): ThemeSubset => {
  return Object.entries(theme).reduce((flat, [k, v]) => {
    if (ignoredKeys.includes(k)) {
      return flat;
    }
    const varName = varNameBuilder(prefix, k);
    return isObject(v) ? { ...flat, ...flattenTheme(v, varName) } : { ...flat, [varName]: v };
  }, {});
};

const collect: ThemeSubset[] = [baseTheme, ...themes];
const cssVarObject = collect.reduce(
  (obj, theme) =>
    merge(
      {},
      obj,
      theme.name
        ? { [`body[data-theme='${theme.name}']`]: flattenTheme(theme, cssVarPrefix) }
        : { body: flattenTheme(theme, cssVarPrefix) }
    ),
  { body: {} }
);
export const cssVarStyle = css(cssVarObject);

// build typed helper for easy usage in emotion taggged template literals / elsewhere
const constructVarHelper = (refTheme: ThemeSubset, prefix: string): Theme => {
  const V: ThemeSubset = {};
  Object.entries(refTheme).forEach(([k, v]) => {
    if (!ignoredKeys.includes(k)) {
      V[k] = isObject(v)
        ? constructVarHelper(v, varNameBuilder(prefix, k))
        : `var(${varNameBuilder(prefix, k)})`;
    }
  });
  return V as Theme;
};

export const V = constructVarHelper(referenceTheme, cssVarPrefix);
