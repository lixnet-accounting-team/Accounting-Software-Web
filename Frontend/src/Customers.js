import React, { useEffect, useState } from "react";
import "./Customers.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (!token) {
          setError("You must be logged in to view customers");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost/accounting-software/Backend/api/customers.php",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setCustomers(data);
        } else {
          setError(data.error || "Failed to fetch customers");
        }
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      const response = await fetch(
        `http://localhost/accounting-software/Backend/api/customers.php?id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setCustomers(customers.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete customer");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();

    const url = showAddModal
      ? "http://localhost/accounting-software/Backend/api/customers.php"
      : `http://localhost/accounting-software/Backend/api/customers.php?id=${editingCustomer.id}`;

    const method = showAddModal ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        if (showAddModal) {
          setCustomers([...customers, data]);
          setShowAddModal(false);
        } else {
          setCustomers(
            customers.map((c) => (c.id === editingCustomer.id ? data : c))
          );
          setEditingCustomer(null);
        }
      } else {
        alert(data.error || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="customers-container">
      <h2>Customer Management</h2>

      {loading && <p>Loading customers...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          {customers.length === 0 ? (
            <p>No Customers Found</p>
          ) : (
            // ✅ Wrap table with scrollable wrapper
            <div className="customers-table-wrapper">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.address}</td>
                      <td>
                        <button onClick={() => openEditModal(customer)}>Edit</button>
                        <button onClick={() => handleDelete(customer.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Floating Add button */}
          <button className="add-customer-btn" onClick={() => setShowAddModal(true)}>+</button>

          {/* Add/Edit Modal */}
          {(showAddModal || editingCustomer) && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>{showAddModal ? "Add Customer" : "Edit Customer"}</h3>
                <form onSubmit={handleAddOrEdit}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                  <button type="submit">{showAddModal ? "Add" : "Update"}</button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingCustomer(null);
                    }}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Customers;
