import React, { useState } from 'react';

function CustomerForm() {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Customer added:', customer);
    // Add API call here later
  };

  return (
    <div>
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} required />
        <input type="tel" placeholder="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} required />
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
}

export default CustomerForm;