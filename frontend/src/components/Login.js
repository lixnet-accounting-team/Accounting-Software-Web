import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Email and password are required');
      return;
    }

    // Log the data being sent for debugging
    console.log('Sending login data:', { email, password });

    axios.post('http://localhost:5000/api/login', { email, password })
      .then(response => {
        console.log('Login successful:', response.data);
        setMessage('Login successful! Redirecting...');
        // Store email in localStorage and pass via state
        localStorage.setItem('userEmail', email);
        setTimeout(() => {
          navigate('/', { state: { email } }); // Pass email in state
        }, 1000); // Brief delay for user feedback
      })
      .catch(error => {
        console.error('Login error details:', error.response?.data || error.message);
        setMessage(error.response?.data?.error || 'Login failed. Please check your credentials.');
      });
  };

  return (
    <div className="card" id="login">
      <h1>Evolve Finance💵</h1>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {message && <p>{message}</p>}
      </form>
      <p>
        Don't have an account? <a href="/register">Sign Up</a>
      </p>
      <style jsx>{`
        body {
          background-color: #f0f0f0;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .card {
          background-color: white;
          padding: 40px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          border-radius: 15px;
          width: 350px;
          max-width: 90%;
          text-align: center;
          transition: transform 0.3s;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        h1 {
          color: #3C5E95;
          margin-bottom: 30px;
          font-size: 28px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #3C5E95;
          margin-bottom: 20px;
          font-size: 22px;
        }
        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #3C5E95;
          border-radius: 8px;
          font-size: 16px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
          box-sizing: border-box;
        }
        button {
          background-color: #3C5E95;
          color: white;
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 100, 0, 0.2);
          transition: background-color 0.3s, box-shadow 0.3s;
        }
        button:hover {
          background-color: #2F4D7E;
          box-shadow: 0 6px 12px rgba(0, 100, 0, 0.3);
        }
        p {
          margin-top: 15px;
          font-size: 14px;
          color: #333;
        }
        a {
          color: #3C5E95;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default Login;