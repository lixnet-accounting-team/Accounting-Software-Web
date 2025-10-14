import React, { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    totalExpenses: 0,
    totalInvoices: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Fetch data from your backend reports API
    fetch("http://localhost/accounting-software/Backend/api/reports.php?action=summary")
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error("Failed to fetch summary:", err));
  }, []);

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>
      <div className="grid">
        <div className="card blue">
          <h2>Customers</h2>
          <p>{summary.totalCustomers}</p>
        </div>
        <div className="card red">
          <h2>Expenses</h2>
          <p>KES {summary.totalExpenses}</p>
        </div>
        <div className="card green">
          <h2>Invoices</h2>
          <p>{summary.totalInvoices}</p>
        </div>
        <div className="card yellow">
          <h2>Revenue</h2>
          <p>KES {summary.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
