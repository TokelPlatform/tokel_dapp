import React from 'react';
import { render } from 'react-dom';
import '../../../assets/fonts/fonts.css';
import '../../styles/global.css';
import '../../styles/variables.css';
import AcccountContextProvider from '../../store/AccountContext';
import Dashboard from './Dashboard';

render(
  <AcccountContextProvider>
    <Dashboard />
  </AcccountContextProvider>,
  document.getElementById('dash')
);
