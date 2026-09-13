/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { getCategoryDetails, formatCurrency, formatDate } from '../utils/categories';

export const Transaction = ({ transaction }) => {
  const { deleteTransaction, setEditingTransaction, currency } = useContext(GlobalContext);

  const isIncome = transaction.amount >= 0;
  const category = getCategoryDetails(transaction.category);
  const formattedDate = formatDate(transaction.date);

  return (
    <li className={`transaction-item ${isIncome ? 'income-item' : 'expense-item'}`}>
      {/* Category Avatar */}
      <div
        className="tx-avatar"
        style={{ backgroundColor: `${category.color}22`, color: category.color }}
      >
        <span className="tx-emoji">{category.icon}</span>
      </div>

      {/* Transaction Details */}
      <div className="tx-details">
        <span className="tx-text">{transaction.text}</span>
        <div className="tx-meta">
          <span
            className="tx-category-badge"
            style={{ backgroundColor: `${category.color}18`, color: category.color }}
          >
            {category.name}
          </span>
          {formattedDate && <span className="tx-date-badge">{formattedDate}</span>}
        </div>
      </div>

      {/* Amount & Actions */}
      <div className="tx-right">
        <span className={`tx-amount ${isIncome ? 'tx-amount-plus' : 'tx-amount-minus'}`}>
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount, currency.symbol)}
        </span>

        <div className="tx-actions">
          <button
            onClick={() => setEditingTransaction(transaction)}
            className="tx-action-btn edit-btn"
            title="Edit Transaction"
            aria-label="Edit transaction"
          >
            ✏️
          </button>
          <button
            onClick={() => deleteTransaction(transaction.id)}
            className="tx-action-btn delete-btn"
            title="Delete Transaction"
            aria-label="Delete transaction"
          >
            🗑️
          </button>
        </div>
      </div>
    </li>
  );
};
