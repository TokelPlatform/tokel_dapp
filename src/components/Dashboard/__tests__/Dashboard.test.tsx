import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  it('should render', () => {
    expect(render(<Dashboard />)).toBeTruthy();
  });
});
