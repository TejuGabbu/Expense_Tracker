import React from 'react';
import { Header } from './components/Header';
import { Balance } from './components/Balance';
import { IncomeExpenses } from './components/IncomeExpenses';
import { BudgetTracker } from './components/BudgetTracker';
import { AnalyticsChart } from './components/AnalyticsChart';
import { AddTransaction } from './components/AddTransaction';
import { TransactionList } from './components/TransactionList';
import { EditTransactionModal } from './components/EditTransactionModal';

import { GlobalProvider } from './context/GlobalState';

import './App.css';

function App() {
  return (
    <GlobalProvider>
      <div className="app-layout">
        <Header />
        <main className="dashboard-container">
          {/* Left Column: Metrics, Budget, Charts & Quick Add */}
          <div className="dashboard-column dashboard-left">
            <Balance />
            <IncomeExpenses />
            <div className="dashboard-subgrid">
              <BudgetTracker />
              <AnalyticsChart />
            </div>
            <AddTransaction />
          </div>

          {/* Right Column: Search, Filters & Transaction Activity */}
          <div className="dashboard-column dashboard-right">
            <TransactionList />
          </div>
        </main>

        <footer className="app-footer">
          <p>FinFlow Smart Finance Dashboard • Powered by React & Modern CSS</p>
        </footer>

        {/* Global Modals */}
        <EditTransactionModal />
      </div>
    </GlobalProvider>
  );
}

export default App;
