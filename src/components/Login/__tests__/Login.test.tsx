import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Login from '../Login';

describe('Login', () => {
  it('should render', () => {
    expect(render(<Login />)).toBeTruthy();
  });
});
