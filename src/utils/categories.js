export const CATEGORIES = [
  { id: 'salary', name: 'Salary & Income', icon: '💼', color: '#10B981', type: 'income' },
  { id: 'freelance', name: 'Freelance & Bonus', icon: '🚀', color: '#06B6D4', type: 'income' },
  { id: 'investment', name: 'Investments', icon: '📈', color: '#8B5CF6', type: 'both' },
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#F59E0B', type: 'expense' },
  { id: 'housing', name: 'Housing & Rent', icon: '🏠', color: '#EF4444', type: 'expense' },
  { id: 'utilities', name: 'Bills & Utilities', icon: '⚡', color: '#EC4899', type: 'expense' },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: '#3B82F6', type: 'expense' },
  { id: 'shopping', name: 'Shopping & Clothes', icon: '🛍️', color: '#F97316', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment & Fun', icon: '🎬', color: '#A855F7', type: 'expense' },
  { id: 'health', name: 'Health & Wellness', icon: '💊', color: '#14B8A6', type: 'expense' },
  { id: 'education', name: 'Education & Books', icon: '📚', color: '#6366F1', type: 'expense' },
  { id: 'other', name: 'Other / Misc', icon: '🏷️', color: '#6B7280', type: 'both' },
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$)' },
  { code: 'AUD', symbol: 'AU$', label: 'AUD (AU$)' },
];

export function getCategoryDetails(categoryId) {
  return CATEGORIES.find(c => c.id === categoryId) || {
    id: 'other',
    name: 'Other',
    icon: '🏷️',
    color: '#6B7280',
    type: 'both'
  };
}

export function formatCurrency(amount, currencySymbol = '$') {
  const absVal = Math.abs(amount);
  const formatted = absVal.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currencySymbol}${formatted}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  }
}

export function exportToCSV(transactions, currencySymbol = '$') {
  if (!transactions || !transactions.length) {
    alert('No transactions to export!');
    return;
  }

  const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount', 'Currency'];
  const rows = transactions.map(t => {
    const category = getCategoryDetails(t.category);
    const type = t.amount >= 0 ? 'Income' : 'Expense';
    const cleanDesc = `"${(t.text || '').replace(/"/g, '""')}"`;
    return [
      t.id,
      t.date || '',
      cleanDesc,
      category.name,
      type,
      Math.abs(t.amount).toFixed(2),
      currencySymbol
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `finflow_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
