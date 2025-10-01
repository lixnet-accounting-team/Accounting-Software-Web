import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function Dashboard() {
  const [userData, setUserData] = useState({ totalIncomeThisMonth: 0, totalExpensesThisMonth: 0, name: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || localStorage.getItem('userEmail'); // Assuming email is passed or stored

  useEffect(() => {
    if (!userEmail) {
      navigate('/login'); // Redirect if no user is logged in
      return;
    }

    // Fetch user-specific data from backend
    axios.get(`http://localhost:5000/api/user-data?email=${userEmail}`)
      .then(response => {
        setUserData({
          totalIncomeThisMonth: response.data.totalIncomeThisMonth || 0,
          totalExpensesThisMonth: response.data.totalExpensesThisMonth || 0,
          name: response.data.name || 'User'
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, [userEmail, navigate]);

  const profitLoss = userData.totalIncomeThisMonth - userData.totalExpensesThisMonth;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <ul>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/customer-management">Customer Management</a></li>
          <li><a href="/basic-invoicing">Basic Invoicing</a></li>
          <li><a href="/simple-expense-tracking">Simple Expense Tracking</a></li>
          <li><a href="/basic-reporting">Basic Reporting</a></li>
        </ul>
      </nav>
      <div className="main-content">
        <div className="header">
          <h1>Dashboard</h1>
          <div className="user-info">{userData.name} <span>Business Manager</span></div>
        </div>
        <div className="stats">
          <div className="stat-item">Total Income This Month: KSh {userData.totalIncomeThisMonth.toLocaleString()}</div>
          <div className="stat-item">Total Expenses This Month: KSh {userData.totalExpensesThisMonth.toLocaleString()}</div>
          <div className="stat-item">Profit/Loss: KSh {profitLoss.toLocaleString()}</div>
        </div>
        <div className="wallet-section">
          <div className="wallet-card">
            <h2>Business Overview for {userData.name}</h2>
            <div className="wallet-amount">Net Profit: KSh {profitLoss.toLocaleString()}</div>
            <p>Last Updated: Today, 04:09 PM</p>
            <div className="wallet-options">
              <button>View Details</button>
            </div>
            <div className="recent-transactions">
              <h3>Key Metrics</h3>
              <ul>
                <li>Cash Flow <span>KSh {profitLoss.toLocaleString()}</span></li>
                <li>Revenue <span>KSh {userData.totalIncomeThisMonth.toLocaleString()}</span></li>
                <li>Expenses <span>KSh {userData.totalExpensesThisMonth.toLocaleString()}</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="payroll-processing">
          <h3>Sales & Invoicing</h3>
          <p>Manage your open invoices and payments</p>
          <button>Go to Invoicing</button>
        </div>
        <div className="recent-activity">
          <h3>Expenses & Vendors</h3>
          <ul>
            <li>Track your expenses by category</li>
          </ul>
        </div>
        <div className="payroll-summary">
          <h3>Profit & Loss</h3>
          <div className="summary-details">
            <p>Income: KSh {userData.totalIncomeThisMonth.toLocaleString()}</p>
            <p>Expenses: KSh {userData.totalExpensesThisMonth.toLocaleString()}</p>
            <p>Profit/Loss: KSh {profitLoss.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <style jsx>{`
        .dashboard-container {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .sidebar {
          width: 200px;
          background: #f4f4f4;
          padding: 20px 0;
          border-right: 1px solid #ddd;
        }
        .sidebar ul {
          list-style: none;
          padding: 0;
        }
        .sidebar ul li {
          margin: 15px 0;
        }
        .sidebar ul li a {
          text-decoration: none;
          color: #333;
          padding: 5px 20px;
          display: block;
        }
        .sidebar ul li a:hover {
          background: #ddd;
        }
        .main-content {
          flex-grow: 1;
          padding: 20px;
          background: #fff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #3C5E95;
          font-size: 24px;
          margin: 0;
        }
        .user-info {
          color: #666;
        }
        .user-info span {
          color: #999;
        }
        .stats {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
          background: #f9f9f9;
          padding: 10px;
          border-radius: 5px;
        }
        .stat-item {
          background: #fff;
          padding: 10px 20px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .wallet-section {
          margin-bottom: 20px;
        }
        .wallet-card {
          background: #3C5E95;
          color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: left;
        }
        .wallet-card h2 {
          font-size: 18px;
          margin: 0 0 10px;
        }
        .wallet-amount {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .wallet-card p {
          font-size: 12px;
          margin: 5px 0;
        }
        .wallet-options {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
        }
        .wallet-options button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
        }
        .wallet-options button:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .recent-transactions h3 {
          font-size: 16px;
          margin: 10px 0 5px;
        }
        .recent-transactions ul {
          list-style: none;
          padding: 0;
          font-size: 12px;
        }
        .recent-transactions ul li {
          margin: 5px 0;
        }
        .recent-transactions ul li span {
          float: right;
        }
        .payroll-processing, .recent-activity, .payroll-summary {
          margin-bottom: 20px;
        }
        .payroll-processing h3, .recent-activity h3, .payroll-summary h3 {
          color: #3C5E95;
          font-size: 18px;
          margin-bottom: 10px;
        }
        .payroll-processing p {
          margin: 5px 0;
        }
        .payroll-processing button {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 5px;
          cursor: pointer;
        }
        .payroll-processing button:hover {
          background: #0056b3;
        }
        .recent-activity ul {
          list-style: none;
          padding: 0;
          font-size: 14px;
        }
        .payroll-summary .summary-details {
          background: #f9f9f9;
          padding: 10px;
          border-radius: 5px;
        }
        .payroll-summary .summary-details p {
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;