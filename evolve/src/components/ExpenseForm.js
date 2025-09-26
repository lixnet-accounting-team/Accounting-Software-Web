import React, { useState } from 'react';

function ExpenseForm() {
  const [expense, setExpense] = useState({ description: '', amount: '', date: '', category: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Expense added:', expense);
    // Add API call here later
  };

  return (
    <div>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Description" value={expense.description} onChange={(e) => setExpense({ ...expense, description: e.target.value })} required />
        <input type="number" placeholder="Amount" value={expense.amount} onChange={(e) => setExpense({ ...expense, amount: e.target.value })} required />
        <input type="date" value={expense.date} onChange={(e) => setExpense({ ...expense, date: e.target.value })} required />
        <input type="text" placeholder="Category" value={expense.category} onChange={(e) => setExpense({ ...expense, category: e.target.value })} required />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}

export default ExpenseForm;