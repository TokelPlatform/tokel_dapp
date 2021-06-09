import 'vars/styles/global.css';
import 'vars/styles/variables.css';
import 'assets/fonts/fonts.css';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import PlatformProvider from 'hooks/platform';
import store from 'store/rematch';

import App from 'components/App';

render(
  <Provider store={store}>
    <PlatformProvider>
      <App />
    </PlatformProvider>
  </Provider>,
  document.getElementById('root')
);
