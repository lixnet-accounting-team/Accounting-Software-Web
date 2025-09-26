import React, { useState } from 'react';

function InvoiceForm() {
  const [invoice, setInvoice] = useState({ customer: '', items: [{ description: '', amount: '' }] });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Invoice created:', invoice);
    // Add API call here later
  };

  return (
    <div>
      <h2>Create Invoice</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Customer" value={invoice.customer} onChange={(e) => setInvoice({ ...invoice, customer: e.target.value })} required />
        {invoice.items.map((item, index) => (
          <div key={index}>
            <input type="text" placeholder="Description" value={item.description} onChange={(e) => {
              const newItems = [...invoice.items];
              newItems[index].description = e.target.value;
              setInvoice({ ...invoice, items: newItems });
            }} />
            <input type="number" placeholder="Amount" value={item.amount} onChange={(e) => {
              const newItems = [...invoice.items];
              newItems[index].amount = e.target.value;
              setInvoice({ ...invoice, items: newItems });
            }} />
          </div>
        ))}
        <button type="button" onClick={() => setInvoice({ ...invoice, items: [...invoice.items, { description: '', amount: '' }] })}>Add Item</button>
        <button type="submit">Create Invoice</button>
      </form>
    </div>
  );
}

export default InvoiceForm;