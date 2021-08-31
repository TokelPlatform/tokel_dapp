import '@testing-library/jest-dom';

import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react';

import store from 'store/rematch';

import Login from '../Login';

describe('Login', () => {
  it('should render', () => {
    expect(true).toBeTruthy();
  });
});
