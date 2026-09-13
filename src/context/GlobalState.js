import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';

export const DEFAULT_TRANSACTIONS = [
  { id: 1, text: 'Tech Corp Salary', amount: 4800, category: 'salary', date: new Date().toISOString().slice(0, 10) },
  { id: 2, text: 'Apartment Rent', amount: -1400, category: 'housing', date: new Date().toISOString().slice(0, 10) },
  { id: 3, text: 'Whole Foods Groceries', amount: -185.50, category: 'food', date: new Date(Date.now() - 86400000).toISOString().slice(0, 10) },
  { id: 4, text: 'Freelance UI Project', amount: 950, category: 'freelance', date: new Date(Date.now() - 172800000).toISOString().slice(0, 10) },
  { id: 5, text: 'Electric & Internet Bills', amount: -120, category: 'utilities', date: new Date(Date.now() - 259200000).toISOString().slice(0, 10) },
  { id: 6, text: 'Fine Dining & Sushi', amount: -85.20, category: 'food', date: new Date(Date.now() - 345600000).toISOString().slice(0, 10) },
  { id: 7, text: 'Gym & Fitness Pass', amount: -65, category: 'health', date: new Date(Date.now() - 432000000).toISOString().slice(0, 10) },
  { id: 8, text: 'Mechanical Keyboard', amount: -140, category: 'shopping', date: new Date(Date.now() - 518400000).toISOString().slice(0, 10) }
];

// Load persisted state or fallback
const savedTransactions = localStorage.getItem('finflow_transactions');
const savedCurrency = localStorage.getItem('finflow_currency');
const savedTheme = localStorage.getItem('finflow_theme');
const savedBudget = localStorage.getItem('finflow_budget');

const initialState = {
  transactions: savedTransactions ? JSON.parse(savedTransactions) : DEFAULT_TRANSACTIONS,
  currency: savedCurrency ? JSON.parse(savedCurrency) : { code: 'USD', symbol: '$' },
  theme: savedTheme ? savedTheme : 'dark',
  monthlyBudget: savedBudget ? parseFloat(savedBudget) : 2500,
  editingTransaction: null
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('finflow_transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('finflow_currency', JSON.stringify(state.currency));
  }, [state.currency]);

  useEffect(() => {
    localStorage.setItem('finflow_theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  useEffect(() => {
    localStorage.setItem('finflow_budget', state.monthlyBudget.toString());
  }, [state.monthlyBudget]);

  // Actions
  function deleteTransaction(id) {
    dispatch({
      type: 'DELETE_TRANSACTION',
      payload: id
    });
  }

  function addTransaction(transaction) {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: transaction
    });
  }

  function editTransaction(transaction) {
    dispatch({
      type: 'EDIT_TRANSACTION',
      payload: transaction
    });
  }

  function setEditingTransaction(transaction) {
    dispatch({
      type: 'SET_EDITING_TRANSACTION',
      payload: transaction
    });
  }

  function setCurrency(currency) {
    dispatch({
      type: 'SET_CURRENCY',
      payload: currency
    });
  }

  function setTheme(theme) {
    dispatch({
      type: 'SET_THEME',
      payload: theme
    });
  }

  function setMonthlyBudget(budget) {
    dispatch({
      type: 'SET_BUDGET',
      payload: budget
    });
  }

  function resetData() {
    dispatch({
      type: 'RESET_DATA',
      payload: DEFAULT_TRANSACTIONS
    });
  }

  function clearAll() {
    dispatch({
      type: 'CLEAR_ALL'
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        currency: state.currency,
        theme: state.theme,
        monthlyBudget: state.monthlyBudget,
        editingTransaction: state.editingTransaction,
        deleteTransaction,
        addTransaction,
        editTransaction,
        setEditingTransaction,
        setCurrency,
        setTheme,
        setMonthlyBudget,
        resetData,
        clearAll
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};