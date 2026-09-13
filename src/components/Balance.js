import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { formatCurrency } from '../utils/categories';

export const Balance = () => {
  const { transactions, currency } = useContext(GlobalContext);

  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0);

  const expense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += Math.abs(item)), 0);

  // Calculate savings rate
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
  const isPositive = total >= 0;

  return (
    <div className="balance-card">
      <div className="balance-header">
        <div className="balance-label-group">
          <span className="balance-pill">Total Net Worth</span>
          <span className="balance-period">All time</span>
        </div>
        <div className={`status-indicator ${isPositive ? 'positive' : 'negative'}`}>
          <span className="indicator-dot"></span>
          <span>{isPositive ? 'Healthy Cash Flow' : 'Deficit Alert'}</span>
        </div>
      </div>

      <div className="balance-amount-wrapper">
        <h2 className="balance-amount">
          {total < 0 && <span className="minus-sign">-</span>}
          {formatCurrency(total, currency.symbol)}
        </h2>
      </div>

      <div className="balance-footer">
        <div className="savings-badge">
          <span className="badge-icon">{savingsRate >= 0 ? '↗' : '↘'}</span>
          <span className="badge-text">
            <strong>{savingsRate}%</strong> savings rate
          </span>
        </div>
        <div className="transaction-count">
          <span>{transactions.length} total entries</span>
        </div>
      </div>
    </div>
  );
};
