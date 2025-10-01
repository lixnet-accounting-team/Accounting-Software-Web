import React from 'react';

function Report() {
  const totalIncome = 1000360; // Placeholder
  const totalExpenses = 2500;  // Placeholder
  const profitLoss = totalIncome - totalExpenses;

  return (
    <div>
      <h2>Financial Report</h2>
      <p>Total Income This Month: KSh {totalIncome}</p>
      <p>Total Expenses This Month: KSh {totalExpenses}</p>
      <p>Profit/Loss: KSh {profitLoss}</p>
    </div>
  );
}

export default Report;