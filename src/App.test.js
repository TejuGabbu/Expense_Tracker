import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

test('renders FinFlow brand header', () => {
  const { getAllByText } = render(<App />);
  const brandElements = getAllByText(/FinFlow/i);
  expect(brandElements.length).toBeGreaterThanOrEqual(1);
});

test('renders Total Net Worth section', () => {
  const { getByText } = render(<App />);
  const netWorthElement = getByText(/Total Net Worth/i);
  expect(netWorthElement).toBeInTheDocument();
});

test('renders Income and Expenses metrics', () => {
  const { getByText } = render(<App />);
  expect(getByText(/Total Income/i)).toBeInTheDocument();
  expect(getByText(/Total Expenses/i)).toBeInTheDocument();
});

test('renders Monthly Budget and Expense Breakdown', () => {
  const { getByText } = render(<App />);
  expect(getByText(/Monthly Budget/i)).toBeInTheDocument();
  expect(getByText(/Expense Breakdown/i)).toBeInTheDocument();
});

test('renders Add New Transaction form', () => {
  const { getByText } = render(<App />);
  expect(getByText(/Add New Transaction/i)).toBeInTheDocument();
});
