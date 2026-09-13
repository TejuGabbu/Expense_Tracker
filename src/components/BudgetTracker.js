/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { formatCurrency } from '../utils/categories';

export const BudgetTracker = () => {
  const { transactions, currency, monthlyBudget, setMonthlyBudget } = useContext(GlobalContext);
  const [isEditing, setIsEditing] = useState(false);
  const [budgetValue, setBudgetValue] = useState(monthlyBudget);

  const totalExpense = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const percentUsed = monthlyBudget > 0 ? Math.min(Math.round((totalExpense / monthlyBudget) * 100), 100) : 0;
  const rawPercent = monthlyBudget > 0 ? Math.round((totalExpense / monthlyBudget) * 100) : 0;
  const remaining = monthlyBudget - totalExpense;

  const handleSave = (e) => {
    e.preventDefault();
    const val = parseFloat(budgetValue);
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val);
      setIsEditing(false);
    }
  };

  let statusClass = 'status-safe';
  let statusText = 'On Track';
  if (rawPercent >= 100) {
    statusClass = 'status-danger';
    statusText = 'Over Budget!';
  } else if (rawPercent >= 75) {
    statusClass = 'status-warning';
    statusText = 'Near Limit';
  }

  return (
    <div className="budget-card">
      <div className="budget-header">
        <div className="budget-title-area">
          <span className="section-subtitle">Financial Goal</span>
          <h3 className="section-title">Monthly Budget</h3>
        </div>
        <div className={`budget-status-pill ${statusClass}`}>
          {statusText}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="budget-edit-form">
          <div className="budget-input-group">
            <span className="currency-prefix">{currency.symbol}</span>
            <input
              type="number"
              min="1"
              step="10"
              value={budgetValue}
              onChange={(e) => setBudgetValue(e.target.value)}
              className="budget-number-input"
              autoFocus
            />
          </div>
          <div className="budget-edit-actions">
            <button type="submit" className="btn-small btn-primary">Save</button>
            <button
              type="button"
              className="btn-small btn-outline"
              onClick={() => {
                setBudgetValue(monthlyBudget);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="budget-values-row">
          <div>
            <span className="budget-stat-label">Spent</span>
            <span className="budget-stat-val expense-color">
              {formatCurrency(totalExpense, currency.symbol)}
            </span>
          </div>
          <div className="budget-limit-wrap">
            <span className="budget-stat-label">Limit</span>
            <div className="budget-clickable-limit" onClick={() => setIsEditing(true)} title="Click to edit budget">
              <span className="budget-stat-val">{formatCurrency(monthlyBudget, currency.symbol)}</span>
              <span className="edit-pencil-icon">✏️</span>
            </div>
          </div>
          <div>
            <span className="budget-stat-label">Remaining</span>
            <span className={`budget-stat-val ${remaining >= 0 ? 'remaining-positive' : 'expense-color'}`}>
              {remaining < 0 ? '-' : ''}{formatCurrency(Math.abs(remaining), currency.symbol)}
            </span>
          </div>
        </div>
      )}

      {/* Visual Progress Bar */}
      <div className="budget-progress-container">
        <div className="budget-progress-track">
          <div
            className={`budget-progress-bar ${statusClass}`}
            style={{ width: `${percentUsed}%` }}
          ></div>
        </div>
        <div className="budget-progress-meta">
          <span>{rawPercent}% used</span>
          <span>{remaining >= 0 ? `${formatCurrency(remaining, currency.symbol)} left` : 'Exceeded limit'}</span>
        </div>
      </div>
    </div>
  );
};
