import React from 'react';
import { render } from 'react-dom';
import '../../../assets/fonts/fonts.css';
import '../../styles/global.css';
import '../../styles/variables.css';
import AcccountContextProvider from 'store/AccountContext';
import Login from './Login';

render(
  <AcccountContextProvider>
    <Login />
  </AcccountContextProvider>,
  document.getElementById('root')
);
