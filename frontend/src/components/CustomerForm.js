import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CustomerForm() {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !customer.phone) {
      setMessage('All fields are required');
      return;
    }

    axios.post('http://localhost:5000/api/customers', customer)
      .then(response => {
        console.log('Customer added:', response.data);
        setMessage('Customer added successfully!');
        setCustomer({ name: '', email: '', phone: '' }); // Clear form
        setTimeout(() => navigate('/customer-management'), 1000); // Redirect after success
      })
      .catch(error => {
        console.error('Error adding customer:', error.response?.data || error.message);
        setMessage(error.response?.data?.error || 'Failed to add customer');
      });
  };

  return (
    <div>
      <h1>Keep track of your clients below👇🏾</h1>
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} required />
        <input type="tel" placeholder="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} required />
        <button type="submit">Add Customer</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default CustomerForm;