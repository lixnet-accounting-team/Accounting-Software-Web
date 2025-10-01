import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function Register() {
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    axios.post('http://localhost:5000/api/register', { name, email, password })
      .then(response => {
        setMessage(response.data.message);
        setname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      })
      .catch(error => {
        console.error('Registration error:', error);
        setMessage(error.response?.data?.error || 'Registration failed');
      });
  };

  return (
    <div className="card" id="signup">
      <h1>Evolve Finance💵</h1>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setname(e.target.value)}
          placeholder="Full Name"
          required
        />
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Sign Up</button>
        {message && <p>{message}</p>}
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Register;