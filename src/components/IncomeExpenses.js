import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { formatCurrency } from '../utils/categories';

export const IncomeExpenses = () => {
  const { transactions, currency } = useContext(GlobalContext);

  const amounts = transactions.map(t => t.amount);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0);

  const expense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += Math.abs(item)), 0);

  const totalFlow = income + expense;
  const incomePercent = totalFlow > 0 ? Math.round((income / totalFlow) * 100) : 50;
  const expensePercent = totalFlow > 0 ? Math.round((expense / totalFlow) * 100) : 50;

  return (
    <div className="inc-exp-section">
      <div className="inc-exp-grid">
        {/* Income Card */}
        <div className="metric-card income-card">
          <div className="metric-header">
            <span className="metric-title">Total Income</span>
            <div className="metric-icon-wrap income-icon">
              <span>↑</span>
            </div>
          </div>
          <div className="metric-value income-value">
            +{formatCurrency(income, currency.symbol)}
          </div>
          <div className="metric-bar-wrap">
            <div className="metric-bar-fill income-fill" style={{ width: `${incomePercent}%` }}></div>
          </div>
          <span className="metric-subtext">{incomePercent}% of total cashflow</span>
        </div>

        {/* Expense Card */}
        <div className="metric-card expense-card">
          <div className="metric-header">
            <span className="metric-title">Total Expenses</span>
            <div className="metric-icon-wrap expense-icon">
              <span>↓</span>
            </div>
          </div>
          <div className="metric-value expense-value">
            -{formatCurrency(expense, currency.symbol)}
          </div>
          <div className="metric-bar-wrap">
            <div className="metric-bar-fill expense-fill" style={{ width: `${expensePercent}%` }}></div>
          </div>
          <span className="metric-subtext">{expensePercent}% of total cashflow</span>
        </div>
      </div>
    </div>
  );
};
