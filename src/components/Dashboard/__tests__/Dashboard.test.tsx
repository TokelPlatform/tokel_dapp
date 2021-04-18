import '@testing-library/jest-dom';

import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react';

import store from 'store/rematch';

import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <Dashboard />
        </Provider>
      )
    ).toBeTruthy();
  });
});
