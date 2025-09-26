import React from 'react';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <ul>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/payroll-wallet">Payroll Wallet</a></li>
          <li><a href="/employees">Employees</a></li>
          <li><a href="/payroll">Payroll</a></li>
          <li><a href="/attendance">Attendance</a></li>
          <li><a href="/leave-management">Leave Management</a></li>
          <li><a href="/reports">Reports</a></li>
          <li><a href="/help-support">Help & Support</a></li>
        </ul>
      </nav>
      <div className="main-content">
        <div className="header">
          <h1>Payroll Dashboard</h1>
          <div className="user-info">John Mwangi <span>HR Manager</span></div>
        </div>
        <div className="stats">
          <div className="stat-item">Total Employees: 42</div>
          <div className="stat-item">Wallet Balance: KSh 1,245,680</div>
          <div className="stat-item">This Month's Payroll: KSh 1,000,360</div>
          <div className="stat-item">Pending Actions: 5</div>
        </div>
        <div className="wallet-section">
          <div className="wallet-card">
            <h2>Payroll Wallet Balance</h2>
            <div className="wallet-amount">KSh 1,245,680</div>
            <p>Last Updated: Today, 06:43 AM</p>
            <div className="wallet-options">
              <button>Mobile Money</button>
              <button>Bank Transfer</button>
              <button>Transaction History</button>
            </div>
            <div className="recent-transactions">
              <h3>Recent Transactions</h3>
              <ul>
                <li>Wallet Top-up <span>+ KSh 1,000,000</span> Today, 06:43 AM</li>
                <li>Salary Disbursement <span>- KSh 254,360</span> Yesterday, 03:30 PM</li>
                <li>Wallet Top-up <span>+ KSh 500,000</span> Mar 15, 2023</li>
              </ul>
            </div>
            <button className="fund-wallet">+ Fund Wallet</button>
          </div>
        </div>
        <div className="payroll-processing">
          <h3>Payroll Processing</h3>
          <p>Next payroll run: 28th February 2023</p>
          <button>Run Payroll</button>
        </div>
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <ul>
            <li>Wallet Funded</li>
          </ul>
        </div>
        <div className="payroll-summary">
          <h3>This Month's Payroll Summary</h3>
          <div className="summary-details">
            <p>Basic Salary: KSh 890,000</p>
            <p>Allowances: KSh 125,000</p>
            <p>Overtime: KSh 45,130</p>
            <p>Deductions (NSSF, NHIF, NSSF): KSh 142,030</p>
            <p>Net Pay: KSh 1,000,360</p>
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
        .fund-wallet {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          width: 100%;
          margin-top: 10px;
        }
        .fund-wallet:hover {
          background: #218838;
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