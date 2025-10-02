import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import InvoiceForm from './components/InvoiceForm';
import InvoiceList from './components/InvoiceList';
import Report from './components/Report';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <h2>Evolve Finance</h2>
          <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
            <li><a href="/expenses/add">Add Expense</a></li>
            <li><a href="/expenses">Expense List</a></li>
            <li><a href="/invoices/add">Add Invoice</a></li>
            <li><a href="/invoices">Invoice List</a></li>
            <li><a href="/report">Report</a></li>
          </ul>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/expenses/add" element={<ExpenseForm />} />
            <Route path="/invoices/add" element={<InvoiceForm />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/report" element={<Report />} />
            <Route path="/add-customer" element={<CustomerForm />} />
            <Route path="/customer-list" element={<CustomerList />} />
            <Route path="/expenses" element={<ExpenseList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;


