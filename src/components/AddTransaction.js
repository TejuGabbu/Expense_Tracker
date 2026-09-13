/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { CATEGORIES } from '../utils/categories';

export const AddTransaction = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'expense' or 'income'
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  const { addTransaction, currency } = useContext(GlobalContext);

  const availableCategories = CATEGORIES.filter(c => c.type === 'both' || c.type === type);

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory('salary');
    } else {
      setCategory('food');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Please enter a description');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setError('');

    const finalAmount = type === 'expense' ? -parsedAmount : parsedAmount;

    const newTransaction = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      text: text.trim(),
      amount: finalAmount,
      category,
      date: date || new Date().toISOString().slice(0, 10)
    };

    addTransaction(newTransaction);

    // Reset inputs
    setText('');
    setAmount('');
  };

  return (
    <div className="add-transaction-card">
      <div className="card-header">
        <span className="section-subtitle">Quick Action</span>
        <h3 className="section-title">Add New Transaction</h3>
      </div>

      <form onSubmit={onSubmit} className="add-form">
        {error && <div className="form-alert-error">{error}</div>}

        {/* Transaction Type Segmented Control */}
        <div className="type-toggle-group">
          <button
            type="button"
            className={`type-toggle-btn ${type === 'expense' ? 'active expense' : ''}`}
            onClick={() => handleTypeChange('expense')}
          >
            <span>📉</span> Expense
          </button>
          <button
            type="button"
            className={`type-toggle-btn ${type === 'income' ? 'active income' : ''}`}
            onClick={() => handleTypeChange('income')}
          >
            <span>📈</span> Income
          </button>
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="tx-desc" className="form-label">Description</label>
          <div className="input-with-icon">
            <span className="input-icon">📝</span>
            <input
              id="tx-desc"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Grocery shopping, Salary bonus..."
              className="form-input"
            />
          </div>
        </div>

        {/* Amount & Category Row */}
        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="tx-amount" className="form-label">
              Amount ({currency.symbol})
            </label>
            <div className="input-with-icon">
              <span className="input-icon">{currency.symbol}</span>
              <input
                id="tx-amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tx-category" className="form-label">Category</label>
            <select
              id="tx-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              {availableCategories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Field */}
        <div className="form-group">
          <label htmlFor="tx-date" className="form-label">Date</label>
          <div className="input-with-icon">
            <span className="input-icon">📅</span>
            <input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`submit-tx-btn ${type === 'expense' ? 'btn-expense-submit' : 'btn-income-submit'}`}
        >
          <span>{type === 'expense' ? '+ Add Expense' : '+ Add Income'}</span>
        </button>
      </form>
    </div>
  );
};
