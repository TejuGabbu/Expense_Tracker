/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { getCategoryDetails, formatCurrency } from '../utils/categories';

export const AnalyticsChart = () => {
  const { transactions, currency } = useContext(GlobalContext);
  const [activeCategory, setActiveCategory] = useState(null);

  // Filter only expenses
  const expenses = transactions.filter(t => t.amount < 0);
  const totalExpense = expenses.reduce((acc, t) => acc + Math.abs(t.amount), 0);

  // Group by category
  const categoryTotals = {};
  expenses.forEach(t => {
    const cat = t.category || 'other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Math.abs(t.amount);
  });

  const categoryData = Object.keys(categoryTotals)
    .map(catId => {
      const details = getCategoryDetails(catId);
      const amount = categoryTotals[catId];
      const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
      return {
        ...details,
        amount,
        percentage
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // SVG Donut calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  let cumulativePercent = 0;

  if (totalExpense === 0) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <span className="section-subtitle">Visual Insights</span>
          <h3 className="section-title">Expense Breakdown</h3>
        </div>
        <div className="chart-empty-state">
          <div className="empty-chart-circle">📊</div>
          <p>No expenses recorded yet</p>
          <span>Add an expense transaction to see category distribution</span>
        </div>
      </div>
    );
  }

  const activeData = activeCategory
    ? categoryData.find(c => c.id === activeCategory)
    : null;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title-wrap">
          <span className="section-subtitle">Visual Insights</span>
          <h3 className="section-title">Expense Breakdown</h3>
        </div>
        <span className="chart-cat-count">{categoryData.length} categories</span>
      </div>

      <div className="chart-content">
        {/* Interactive SVG Donut */}
        <div className="donut-wrapper">
          <svg className="donut-svg" viewBox="0 0 100 100">
            {/* Background base circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="donut-bg"
              fill="none"
              strokeWidth="13"
            />

            {categoryData.map(item => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += item.percentage;

              const isHighlighted = activeCategory === item.id;

              return (
                <circle
                  key={item.id}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={isHighlighted ? 15 : 13}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className={`donut-segment ${isHighlighted ? 'active' : ''}`}
                  onMouseEnter={() => setActiveCategory(item.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                />
              );
            })}
          </svg>

          {/* Center text of Donut */}
          <div className="donut-center-info">
            {activeData ? (
              <>
                <span className="donut-center-icon">{activeData.icon}</span>
                <span className="donut-center-label">{activeData.name}</span>
                <span className="donut-center-val">{activeData.percentage.toFixed(1)}%</span>
              </>
            ) : (
              <>
                <span className="donut-center-label">Total Spent</span>
                <span className="donut-center-val-total">
                  {formatCurrency(totalExpense, currency.symbol)}
                </span>
                <span className="donut-center-hint">Hover slice</span>
              </>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="chart-legend-list">
          {categoryData.slice(0, 5).map(item => {
            const isHovered = activeCategory === item.id;
            return (
              <div
                key={item.id}
                className={`legend-item ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setActiveCategory(item.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="legend-item-left">
                  <span className="legend-color-dot" style={{ backgroundColor: item.color }}></span>
                  <span className="legend-item-icon">{item.icon}</span>
                  <span className="legend-item-name">{item.name}</span>
                </div>
                <div className="legend-item-right">
                  <span className="legend-item-amount">{formatCurrency(item.amount, currency.symbol)}</span>
                  <span className="legend-item-percent">{item.percentage.toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
          {categoryData.length > 5 && (
            <div className="legend-more-note">
              +{categoryData.length - 5} more categories
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
