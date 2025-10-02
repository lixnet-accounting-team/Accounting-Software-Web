import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch customers from the backend
    axios.get('http://localhost:5000/api/customers')
      .then(response => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="customer-list-container">
      <h2>Customer List</h2>
      {customers.length > 0 ? (
        <table className="customer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No customers recorded yet.</p>
      )}
      <style jsx>{`
        .customer-list-container {
          padding: 20px;
        }
        h2 {
          color: #3C5E95;
          margin-bottom: 20px;
        }
        .customer-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .customer-table th,
        .customer-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .customer-table th {
          background-color: #3C5E95;
          color: white;
          font-weight: bold;
        }
        .customer-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .customer-table tr:hover {
          background-color: #f1f1f1;
        }
        p {
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}

export default CustomerList;