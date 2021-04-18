import 'vars/styles/global.css';
import 'vars/styles/variables.css';
import 'assets/fonts/fonts.css';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from 'store/rematch';

import App from 'components/App';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
