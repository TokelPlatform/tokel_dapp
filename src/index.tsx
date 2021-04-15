import React from 'react';
import {
  MemoryRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { render } from 'react-dom';

import 'styles/global.css';
import 'styles/variables.css';
import AcccountContextProvider from 'store/AccountContext';
import Dashboard from 'components/Dashboard/Dashboard';
import Login from 'components/Login/Login';

render(
  <AcccountContextProvider>
    <Router>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/login" component={Login} />
        <Route component={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  </AcccountContextProvider>,
  document.getElementById('root')
);
