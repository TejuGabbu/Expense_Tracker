/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useContext, useState } from 'react';
import { Transaction } from './Transaction';
import { GlobalContext } from '../context/GlobalState';
import { CATEGORIES } from '../utils/categories';

export const TransactionList = () => {
  const { transactions } = useContext(GlobalContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc'

  // Filtering
  const filtered = transactions.filter(t => {
    // Search match
    const matchesSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase());

    // Type match
    const matchesType =
      filterType === 'all'
        ? true
        : filterType === 'income'
        ? t.amount >= 0
        : t.amount < 0;

    // Category match
    const matchesCategory =
      filterCategory === 'all' ? true : t.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date || 0) - new Date(a.date || 0);
    } else if (sortBy === 'date-asc') {
      return new Date(a.date || 0) - new Date(b.date || 0);
    } else if (sortBy === 'amount-desc') {
      return Math.abs(b.amount) - Math.abs(a.amount);
    } else if (sortBy === 'amount-asc') {
      return Math.abs(a.amount) - Math.abs(b.amount);
    }
    return 0;
  });

  return (
    <div className="transaction-history-card">
      <div className="history-header">
        <div className="history-title-wrap">
          <span className="section-subtitle">Activity Log</span>
          <h3 className="section-title">Recent Transactions</h3>
        </div>
        <span className="history-count-badge">
          {sorted.length} {sorted.length === 1 ? 'record' : 'records'}
        </span>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="filter-toolbar">
        {/* Search input */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Type Filter Pills */}
        <div className="type-pills">
          <button
            className={`pill-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            className={`pill-btn income-pill ${filterType === 'income' ? 'active' : ''}`}
            onClick={() => setFilterType('income')}
          >
            Income
          </button>
          <button
            className={`pill-btn expense-pill ${filterType === 'expense' ? 'active' : ''}`}
            onClick={() => setFilterType('expense')}
          >
            Expenses
          </button>
        </div>

        {/* Category & Sort controls */}
        <div className="filter-dropdowns-row">
          <div className="filter-select-group">
            <label htmlFor="cat-filter" className="sr-only">Filter by Category</label>
            <select
              id="cat-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <label htmlFor="sort-select" className="sr-only">Sort by</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date-desc">Newest Date</option>
              <option value="date-asc">Oldest Date</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Items */}
      {sorted.length > 0 ? (
        <ul className="transaction-list">
          {sorted.map(transaction => (
            <Transaction key={transaction.id} transaction={transaction} />
          ))}
        </ul>
      ) : (
        <div className="empty-history-state">
          <div className="empty-icon">📂</div>
          <h4>No transactions found</h4>
          <p>
            {transactions.length === 0
              ? 'Start by adding your first transaction using the form on the left.'
              : 'Try adjusting your search or filters to see more results.'}
          </p>
          {(searchQuery || filterType !== 'all' || filterCategory !== 'all') && (
            <button
              className="btn-secondary btn-small"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterCategory('all');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
