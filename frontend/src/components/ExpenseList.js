import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-10"
    axios.get(`http://localhost:5000/api/expenses?month=${currentMonth}`)
      .then(response => {
        setExpenses(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="expense-list-container">
      <h2>Expense List (Current Month)</h2>
      {expenses.length > 0 ? (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount (KSh)</th>
              <th>Date</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.description}</td>
                <td>{exp.amount.toLocaleString()}</td>
                <td>{exp.date}</td>
                <td>{exp.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No expenses recorded this month.</p>
      )}
      <style jsx>{`
        .expense-list-container {
          padding: 20px;
        }
        h2 {
          color: #3C5E95;
          margin-bottom: 20px;
        }
        .expense-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .expense-table th,
        .expense-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .expense-table th {
          background-color: #3C5E95;
          color: white;
          font-weight: bold;
        }
        .expense-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .expense-table tr:hover {
          background-color: #f1f1f1;
        }
        p {
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

export default ExpenseList;