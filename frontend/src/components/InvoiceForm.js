import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function InvoiceForm() {
  const [invoice, setInvoice] = useState({
    date: '',
    customerId: '',
    items: [{ description: '', amount: '' }],
  });
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/latest-invoice')
      .then(response => {
        const nextNumber = response.data.lastInvoiceNumber + 1;
        setInvoiceNumber(`INV-${String(nextNumber).padStart(4, '0')}`);
      })
      .catch(error => {
        console.error('Error fetching latest invoice:', error);
        setInvoiceNumber(`INV-0001`);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = invoice.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    if (!invoice.date || !invoice.customerId || invoice.items.some(item => !item.description || !item.amount)) {
      setMessage('All fields are required');
      return;
    }

    const invoiceData = { invoiceNumber, date: invoice.date, customerId: invoice.customerId, total, items: invoice.items };

    axios.post('http://localhost:5000/api/invoices', invoiceData)
      .then(response => {
        console.log('Invoice created:', response.data);
        setMessage('Invoice created successfully!');
        setInvoice({ date: '', customerId: '', items: [{ description: '', amount: '' }] });
        setTimeout(() => navigate('/basic-invoicing'), 1000);
      })
      .catch(error => {
        console.error('Error creating invoice:', error.response?.data || error.message);
        setMessage(error.response?.data?.error || 'Failed to create invoice');
      });
  };

  const addItem = () => {
    setInvoice({ ...invoice, items: [...invoice.items, { description: '', amount: '' }] });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index][field] = value;
    setInvoice({ ...invoice, items: newItems });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <h2>Create Invoice</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Invoice Number"
          value={invoiceNumber}
          readOnly
        />
        <input
          type="date"
          value={invoice.date}
          onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Customer ID"
          value={invoice.customerId}
          onChange={(e) => setInvoice({ ...invoice, customerId: e.target.value })}
          required
        />
        {invoice.items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={item.amount}
              onChange={(e) => updateItem(index, 'amount', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addItem}>Add Item</button>
        <button type="submit">Create Invoice</button>
        <button type="button" onClick={handlePrint}>Print Invoice</button>
        {message && <p>{message}</p>}
      </form>
      <style jsx>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          form {
            width: 100%;
            max-width: 800px;
            margin: 20px auto;
            border: 1px solid #000;
            padding: 20px;
          }
          input, textarea, button {
            display: block;
            margin: 10px 0;
            width: 100%;
            box-sizing: border-box;
          }
          button {
            display: none; /* Hide buttons on print */
          }
          h2 {
            text-align: center;
            color: #000;
          }
          p {
            display: block; /* Ensure message shows if present */
          }
        }
        @media screen {
          form {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 600px;
            margin: 20px 0;
          }
          input, textarea {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          button {
            padding: 8px 15px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background: #0056b3;
          }
          p {
            margin: 10px 0;
            color: #d32f2f;
          }
        }
      `}</style>
    </div>
  );
}

export default InvoiceForm;