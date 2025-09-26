import React from 'react';

function CustomerList() {
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
  ];

  return (
    <div>
      <h2>Customer List</h2>
      <ul>
        {customers.map((cust) => (
          <li key={cust.id}>
            {cust.name} - {cust.email} - {cust.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerList;