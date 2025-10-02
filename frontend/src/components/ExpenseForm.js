import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ExpenseForm() {
  const [expense, setExpense] = useState({ description: '', amount: '', date: '', category: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expense.description || !expense.amount || !expense.date || !expense.category) {
      setMessage('All fields are required');
      return;
    }

    // Convert amount to number
    const expenseData = { ...expense, amount: Number(expense.amount) };

    axios.post('http://localhost:5000/api/expenses', expenseData)
      .then(response => {
        console.log('Expense added:', response.data);
        setMessage('Expense added successfully!');
        setExpense({ description: '', amount: '', date: '', category: '' }); // Clear form
        setTimeout(() => navigate('/simple-expense-tracking'), 1000); // Redirect after success
      })
      .catch(error => {
        console.error('Error adding expense:', error.response?.data || error.message);
        setMessage(error.response?.data?.error || 'Failed to add expense');
      });
  };

  return (
    <div>
      <h1>Keep track of your expenses below👇🏾</h1>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={expense.description}
          onChange={(e) => setExpense({ ...expense, description: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={expense.amount}
          onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
          required
        />
        <input
          type="date"
          value={expense.date}
          onChange={(e) => setExpense({ ...expense, date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={expense.category}
          onChange={(e) => setExpense({ ...expense, category: e.target.value })}
          required
        />
        <button type="submit">Add Expense</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default ExpenseForm;