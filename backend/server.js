const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

console.log('Environment variables:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '****' : 'undefined',
  DB_NAME: process.env.DB_NAME,
  PORT: process.env.PORT
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
    connection.release();
  }
});

// Existing GET /api/customers
app.get('/api/customers', (req, res) => {
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Existing POST /api/customers
app.post('/api/customers', (req, res) => {
  const { name, email, phone } = req.body;
  db.query('INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)', [name, email, phone], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, message: 'Customer added' });
  });
});

// Existing POST /api/register for user signup
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' });
  }
  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'User registered successfully' });
    }
  );
});

// New POST /api/login for user authentication
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password], // In production, compare hashed passwords
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.json({ message: 'Login successful', user: results[0] });
    }
  );
});


app.get('/api/user-data', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  db.query(
    'SELECT name, SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as totalIncomeThisMonth, SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as totalExpensesThisMonth FROM users u LEFT JOIN transactions t ON u.email = t.user_email WHERE u.email = ? AND t.date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) GROUP BY u.email, u.name',
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'User not found' });
      res.json({
        name: results[0].name,
        totalIncomeThisMonth: results[0].totalIncomeThisMonth || 0,
        totalExpensesThisMonth: results[0].totalExpensesThisMonth || 0
      });
    }
  );
});


app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
