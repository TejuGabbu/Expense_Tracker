export default (state, action) => {
  switch (action.type) {
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };

    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
        editingTransaction: null
      };

    case 'SET_EDITING_TRANSACTION':
      return {
        ...state,
        editingTransaction: action.payload
      };

    case 'SET_CURRENCY':
      return {
        ...state,
        currency: action.payload
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };

    case 'SET_BUDGET':
      return {
        ...state,
        monthlyBudget: action.payload
      };

    case 'RESET_DATA':
      return {
        ...state,
        transactions: action.payload
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        transactions: []
      };

    default:
      return state;
  }
};