/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { CATEGORIES } from '../utils/categories';

export const EditTransactionModal = () => {
  const { editingTransaction, setEditingTransaction, editTransaction, currency } = useContext(GlobalContext);

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setText(editingTransaction.text || '');
      setAmount(Math.abs(editingTransaction.amount).toString());
      setType(editingTransaction.amount >= 0 ? 'income' : 'expense');
      setCategory(editingTransaction.category || 'other');
      setDate(editingTransaction.date || new Date().toISOString().slice(0, 10));
      setError('');
    }
  }, [editingTransaction]);

  if (!editingTransaction) return null;

  const handleClose = () => {
    setEditingTransaction(null);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Please provide a description');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    const finalAmount = type === 'expense' ? -parsedAmount : parsedAmount;

    editTransaction({
      ...editingTransaction,
      text: text.trim(),
      amount: finalAmount,
      category,
      date: date || new Date().toISOString().slice(0, 10)
    });
  };

  const availableCategories = CATEGORIES.filter(c => c.type === 'both' || c.type === type);

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-subtitle">Modify Entry</span>
            <h3 className="modal-title">Edit Transaction</h3>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-form">
          {error && <div className="form-alert-error">{error}</div>}

          {/* Type Toggle */}
          <div className="type-toggle-group">
            <button
              type="button"
              className={`type-toggle-btn ${type === 'expense' ? 'active expense' : ''}`}
              onClick={() => setType('expense')}
            >
              <span>📉</span> Expense
            </button>
            <button
              type="button"
              className={`type-toggle-btn ${type === 'income' ? 'active income' : ''}`}
              onClick={() => setType('income')}
            >
              <span>📈</span> Income
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Amount ({currency.symbol})</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
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

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
