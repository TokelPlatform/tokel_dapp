import React from 'react';
import { createMemoryHistory } from 'history';
import { Redirect } from 'react-router-dom';

export const history = createMemoryHistory();

let loggedIn = false;
export const setLoggedIn = (status) => {
  loggedIn = status;
};

export const protect = (wrapped) => {
  return loggedIn ? wrapped : () => <Redirect to="/login" />;
};

export const redirect = (wrapped) => {
  return loggedIn ? () => <Redirect to="/" /> : wrapped;
};
