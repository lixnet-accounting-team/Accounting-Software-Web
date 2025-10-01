import React from 'react';

function ExpenseList() {
  const expenses = [
    { id: 1, description: 'Office Supplies', amount: 2000, date: '2025-09-25', category: 'Supplies' },
  ];

  return (
    <div>
      <h2>Expense List</h2>
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            {exp.description} - KSh {exp.amount} - {exp.date} - {exp.category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;