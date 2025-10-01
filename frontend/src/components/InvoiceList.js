import React from 'react';

function InvoiceList() {
  const invoices = [
    { id: 1, customer: 'John Doe', total: 5000 },
  ];

  return (
    <div>
      <h2>Invoice List</h2>
      <ul>
        {invoices.map((inv) => (
          <li key={inv.id}>
            {inv.customer} - KSh {inv.total}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InvoiceList;