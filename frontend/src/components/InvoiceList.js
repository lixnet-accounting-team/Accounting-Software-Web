import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/invoices')
      .then(response => {
        setInvoices(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching invoices:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="invoice-list-container">
      <h2>Invoice List</h2>
      {invoices.length > 0 ? (
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Total (KSh)</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              let itemsArray = [];
              try {
                itemsArray = typeof invoice.items === 'string' ? JSON.parse(invoice.items) : (Array.isArray(invoice.items) ? invoice.items : []);
              } catch (e) {
                console.error('Failed to parse items for invoice', invoice.id, e);
                itemsArray = [];
              }
              return (
                <tr key={invoice.id}>
                  <td>{invoice.invoice_number}</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.customer_id}</td>
                  <td>{invoice.total?.toLocaleString()}</td>
                  <td>
                    {itemsArray.length > 0 ? (
                      itemsArray.map((item, index) => (
                        <div key={index}>{item.description}: {item.amount}</div>
                      ))
                    ) : (
                      <div>No items</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No invoices recorded yet.</p>
      )}
      <style>
        {`
          .invoice-list-container { padding: 20px; }
          h2 { color: #3C5E95; margin-bottom: 20px; }
          .invoice-table { width: 100%; border-collapse: collapse; background-color: #fff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
          .invoice-table th, .invoice-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          .invoice-table th { background-color: #3C5E95; color: white; font-weight: bold; }
          .invoice-table tr:nth-child(even) { background-color: #f9f9f9; }
          .invoice-table tr:hover { background-color: #f1f1f1; }
          .invoice-table td div { margin: 5px 0; }
          p { color: #666; font-style: italic; }
        `}
      </style>
    </div>
  );
}

export default InvoiceList;