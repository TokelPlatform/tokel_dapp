import React from 'react';
import { Route, Switch, MemoryRouter as Router, Link } from 'react-router-dom';
import { render } from 'react-dom';

import 'styles/global.css';
import 'styles/variables.css';
import AcccountContextProvider from 'store/AccountContext';
import Login from 'components/Login/Login';

const dash = () => <div>DASHBOARD<Link to="/login">Go to login</Link></div>;

render(
  <AcccountContextProvider>
    <Router>
      <Switch>
        <Route exact path="/" component={dash} />
        <Route exact path="/login" component={Login} />
        <Route component={() => <div>ERROR</div>} />
      </Switch>
    </Router>
  </AcccountContextProvider>,
  document.getElementById('root')
);
