/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { CURRENCIES, exportToCSV } from '../utils/categories';

export const Header = () => {
  const { currency, setCurrency, theme, setTheme, transactions, resetData, clearAll } = useContext(GlobalContext);
  const [showMenu, setShowMenu] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleCurrencyChange = (e) => {
    const selected = CURRENCIES.find(c => c.code === e.target.value);
    if (selected) {
      setCurrency({ code: selected.code, symbol: selected.symbol });
    }
  };

  const handleExport = () => {
    exportToCSV(transactions, currency.symbol);
    setShowMenu(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset all transactions to default demo data?')) {
      resetData();
      setShowMenu(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to delete all transactions?')) {
      clearAll();
      setShowMenu(false);
    }
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-logo">
          <span>💎</span>
        </div>
        <div className="brand-info">
          <div className="brand-title-wrap">
            <h1 className="brand-name">FinFlow</h1>
            <span className="brand-badge">PRO</span>
          </div>
          <p className="brand-subtitle">Smart Finance & Expense Tracker</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Currency Switcher */}
        <div className="action-item currency-selector">
          <label htmlFor="currency-select" className="sr-only">Select Currency</label>
          <select
            id="currency-select"
            value={currency.code}
            onChange={handleCurrencyChange}
            aria-label="Currency"
            className="select-input"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button
          className="icon-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Export Button */}
        <button
          className="btn-secondary export-btn"
          onClick={handleExport}
          title="Export transactions as CSV"
        >
          <span>📥</span> <span className="btn-text">Export CSV</span>
        </button>

        {/* More Options Dropdown */}
        <div className="more-menu-container">
          <button
            className="icon-btn more-btn"
            onClick={() => setShowMenu(!showMenu)}
            title="More Options"
            aria-label="More options"
          >
            ⚙️
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleExport}>
                📥 Export to CSV
              </button>
              <button className="dropdown-item" onClick={handleReset}>
                🔄 Load Demo Data
              </button>
              <button className="dropdown-item danger" onClick={handleClear}>
                🗑️ Clear All Data
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
