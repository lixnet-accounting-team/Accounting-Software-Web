import React, { useEffect, useState } from "react";
import "./Invoices.css";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null); // invoice object or null
  const [editForm, setEditForm] = useState(getEmptyInvoiceForm());

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadInvoices();
    // eslint-disable-next-line
  }, []);

  async function loadInvoices() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "http://localhost/accounting-software/Backend/api/invoices.php?action=list&format=json",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Server error while fetching invoices");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- View invoice (open modal) ----------------
  async function handleView(id) {
    try {
      const res = await fetch(
        `http://localhost/accounting-software/Backend/api/invoices.php?action=view&id=${encodeURIComponent(
          id
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to fetch invoice");
      }
      const data = await res.json();
      // Backend returns flat object with items array inside
      setViewInvoice(data);
      setShowViewModal(true);
    } catch (err) {
      console.error("View invoice error:", err);
      alert("Failed to load invoice for viewing.");
    }
  }

  // Print handler for view modal
  function handlePrint() {
    // Open print for the modal content
    window.print();
  }

  // ---------------- Add invoice (open blank modal) ----------------
  function handleOpenAdd() {
    setEditingInvoice(null);
    setEditForm(getEmptyInvoiceForm());
    setShowEditModal(true);
  }

  // ---------------- Edit invoice (open modal prefilled) ----------------
  async function handleEdit(id) {
    try {
      const res = await fetch(
        `http://localhost/accounting-software/Backend/api/invoices.php?action=view&id=${encodeURIComponent(
          id
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to fetch invoice");
      }
      const data = await res.json();
      // Backend returns flat object: {id, invoice_number, customer_name, ..., items: [...]}
      const items = data.items || [];
      
      // Set editingInvoice with the full invoice data including id
      setEditingInvoice(data);
      
      // Calculate tax_percent from subtotal and tax
      const subtotal = data.subtotal || 0;
      const tax = data.tax || 0;
      const tax_percent = subtotal > 0 ? Math.round((tax / subtotal) * 100) : 0;
      
      setEditForm({
        customer: {
          name: data.customer_name || "",
          email: data.customer_email || "",
          phone: data.customer_phone || "",
          address: data.customer_address || "",
        },
        items: items.map((it) => ({
          description: it.description || "",
          quantity: it.quantity || 1,
          unit_price: it.unit_price || 0,
        })),
        tax_percent: tax_percent,
        notes: data.notes || "",
        date: data.date || "",
        due_date: data.due_date || "",
      });
      setShowEditModal(true);
    } catch (err) {
      console.error("Edit invoice fetch error:", err);
      alert("Failed to load invoice for editing.");
    }
  }

  // ---------------- Delete invoice ----------------
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const res = await fetch(
        `http://localhost/accounting-software/Backend/api/invoices.php?action=delete&id=${encodeURIComponent(
          id
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (res.ok) {
        // Optimistic remove
        setInvoices((prev) => prev.filter((i) => String(i.id) !== String(id)));
        alert("Invoice deleted successfully");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete invoice");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting invoice");
    }
  }

  // ---------------- Edit/Add form helpers ----------------
  function getItemsSubtotal(items) {
    return items.reduce((s, it) => s + Number(it.quantity || 0) * Number(it.unit_price || 0), 0);
  }

  function handleEditField(path, value) {
    // path like "customer.name" or "tax_percent"
    if (path.startsWith("customer.")) {
      const field = path.split(".")[1];
      setEditForm((prev) => ({ ...prev, customer: { ...prev.customer, [field]: value } }));
    } else {
      setEditForm((prev) => ({ ...prev, [path]: value }));
    }
  }

  function handleItemChange(index, field, value) {
    setEditForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  }

  function addItemRow() {
    setEditForm((prev) => ({ ...prev, items: [...prev.items, { description: "", quantity: 1, unit_price: 0 }] }));
  }

  function removeItemRow(i) {
    setEditForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));
  }

  // ---------------- Submit Add / Update ----------------
  async function handleSubmitEdit(e) {
    e.preventDefault();

    // Validate items
    if (editForm.items.length === 0 || !editForm.items.some(it => it.description.trim())) {
      alert("Please add at least one item with a description");
      return;
    }

    // build payload like backend expects
    const payload = {
      customer: {
        name: editForm.customer.name,
        email: editForm.customer.email,
        phone: editForm.customer.phone,
        address: editForm.customer.address,
      },
      items: editForm.items.map((it) => ({
        description: it.description,
        quantity: Number(it.quantity),
        unit_price: Number(it.unit_price),
      })),
      tax_percent: Number(editForm.tax_percent) || 0,
      notes: editForm.notes,
      date: editForm.date || undefined,
      due_date: editForm.due_date || undefined,
    };

    // If editingInvoice is null => create, else update
    if (!editingInvoice) {
      // CREATE
      try {
        const res = await fetch(
          "http://localhost/accounting-software/Backend/api/invoices.php?action=create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await res.json();
        if (res.ok && data.success) {
          alert("Invoice created successfully");
          // Reload to get fresh data
          await loadInvoices();
          setShowEditModal(false);
        } else {
          console.error(data);
          alert(data.error || "Failed to create invoice");
        }
      } catch (err) {
        console.error("Create invoice error:", err);
        alert("Server error creating invoice");
      }
    } else {
      // UPDATE
      try {
        const res = await fetch(
          `http://localhost/accounting-software/Backend/api/invoices.php?action=update&id=${encodeURIComponent(
            editingInvoice.id
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(payload),
          }
        );
        
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data.success) {
            alert("Invoice updated successfully");
            // Reload list to reflect changes
            await loadInvoices();
            setShowEditModal(false);
          } else {
            alert(data.error || "Failed to update invoice");
          }
        } else {
          const data = await res.json().catch(() => ({}));
          alert(data.error || "Failed to update invoice");
        }
      } catch (err) {
        console.error("Update invoice error:", err);
        alert("Server error while updating invoice");
      }
    }
  }

  // ---------------- Filtered list ----------------
  const filteredInvoices = invoices.filter((inv) =>
    (inv.customer_name || "").toString().toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // ---------------- Render ----------------
  return (
    <div className="invoices-container">
      <div className="invoices-header-row">
        <h2 className="invoices-title">Invoice Management</h2>
        <div className="invoices-header-controls">
          <input
            className="invoices-search"
            placeholder="Search by Customer Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && <p style={{ padding: 20 }}>Loading invoices...</p>}
      {error && <p className="error" style={{ padding: 20 }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="invoices-table-wrapper">
            <table className="invoices-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Total (KSh)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>No invoices found.</td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv, idx) => (
                    <tr key={inv.id} className={idx % 2 === 0 ? "row-light" : "row-dark"}>
                      <td>{inv.invoice_number || inv.id}</td>
                      <td>{inv.date || ""}</td>
                      <td>{inv.customer_name || ""}</td>
                      <td>{Number(inv.total || 0).toFixed(2)}</td>
                      <td>
                        <button className="btn-view" onClick={() => handleView(inv.id)}>View</button>
                        <button className="btn-edit" onClick={() => handleEdit(inv.id)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(inv.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <button className="add-invoice-btn" onClick={handleOpenAdd}>+</button>
        </>
      )}

      {/* ---------------- View Invoice Modal ---------------- */}
      {showViewModal && viewInvoice && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-modal-header">
              <h3>Invoice: {viewInvoice.invoice_number || viewInvoice.id}</h3>
              <div>
                <button className="modal-save-btn" onClick={handlePrint}>Print / Save PDF</button>
                <button className="modal-cancel-btn" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>

            <div className="invoice-content">
              <div className="invoice-meta">
                <div><strong>Date:</strong> {viewInvoice.date}</div>
                <div><strong>Due:</strong> {viewInvoice.due_date || "-"}</div>
              </div>

              <div className="invoice-billto">
                <strong>Bill to:</strong>
                <div>{viewInvoice.customer_name}</div>
                {viewInvoice.customer_address && <div>{viewInvoice.customer_address}</div>}
                {viewInvoice.customer_email && <div>{viewInvoice.customer_email}</div>}
                {viewInvoice.customer_phone && <div>{viewInvoice.customer_phone}</div>}
              </div>

              <table className="invoice-items-table">
                <thead>
                  <tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {Array.isArray(viewInvoice.items) && viewInvoice.items.map((it, i) => (
                    <tr key={i}>
                      <td>{it.description}</td>
                      <td className="right">{it.quantity}</td>
                      <td className="right">{Number(it.unit_price).toFixed(2)}</td>
                      <td className="right">{Number(it.line_total).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan="3" className="right"><strong>Subtotal</strong></td>
                    <td className="right"><strong>{Number(viewInvoice.subtotal || 0).toFixed(2)}</strong></td>
                  </tr>
                  <tr className="total-row">
                    <td colSpan="3" className="right"><strong>Tax</strong></td>
                    <td className="right"><strong>{Number(viewInvoice.tax || 0).toFixed(2)}</strong></td>
                  </tr>
                  <tr className="total-row">
                    <td colSpan="3" className="right"><strong>Total</strong></td>
                    <td className="right"><strong>{Number(viewInvoice.total || 0).toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>

              {viewInvoice.notes && (
                <div className="invoice-notes"><strong>Notes:</strong><div>{viewInvoice.notes}</div></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Add / Edit Modal ---------------- */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <h3>{editingInvoice ? `Edit Invoice ${editingInvoice.invoice_number || editingInvoice.id}` : "Create New Invoice"}</h3>

            <form onSubmit={handleSubmitEdit} className="invoice-edit-form">
              <div className="form-row">
                <input
                  required
                  placeholder="Customer name"
                  value={editForm.customer.name}
                  onChange={(e) => handleEditField("customer.name", e.target.value)}
                />
                <input
                  type="email"
                  required
                  placeholder="Customer email"
                  value={editForm.customer.email}
                  onChange={(e) => handleEditField("customer.email", e.target.value)}
                />
              </div>

              <div className="form-row">
                <input
                  placeholder="Customer phone"
                  value={editForm.customer.phone}
                  onChange={(e) => handleEditField("customer.phone", e.target.value)}
                />
                <input
                  placeholder="Customer address"
                  value={editForm.customer.address}
                  onChange={(e) => handleEditField("customer.address", e.target.value)}
                />
              </div>

              <div className="items-section">
                <label>Items</label>
                {editForm.items.map((it, i) => (
                  <div className="invoice-item-row" key={i}>
                    <input
                      required
                      placeholder="Description"
                      value={it.description}
                      onChange={(e) => handleItemChange(i, "description", e.target.value)}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={it.quantity}
                      onChange={(e) => handleItemChange(i, "quantity", Number(e.target.value))}
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Unit price"
                      value={it.unit_price}
                      onChange={(e) => handleItemChange(i, "unit_price", Number(e.target.value))}
                    />
                    {editForm.items.length > 1 && (
                      <button type="button" className="remove-item-btn" onClick={() => removeItemRow(i)}>×</button>
                    )}
                  </div>
                ))}

                <button type="button" className="add-item-btn" onClick={addItemRow}>+ Add Item</button>
              </div>

              <div className="form-row">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Tax (%)"
                  value={editForm.tax_percent}
                  onChange={(e) => handleEditField("tax_percent", e.target.value)}
                />
                <input
                  type="date"
                  placeholder="Date"
                  value={editForm.date || ""}
                  onChange={(e) => handleEditField("date", e.target.value)}
                />
                <input
                  type="date"
                  placeholder="Due date"
                  value={editForm.due_date || ""}
                  onChange={(e) => handleEditField("due_date", e.target.value)}
                />
              </div>

              <textarea
                placeholder="Notes"
                value={editForm.notes}
                onChange={(e) => handleEditField("notes", e.target.value)}
              />

              <div className="modal-buttons">
                <button type="submit" className="modal-save-btn">{editingInvoice ? "Save Changes" : "Create Invoice"}</button>
                <button type="button" className="modal-cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to produce empty form structure
function getEmptyInvoiceForm() {
  return {
    customer: { name: "", email: "", phone: "", address: "" },
    items: [{ description: "", quantity: 1, unit_price: 0 }],
    tax_percent: 0,
    notes: "",
    date: "",
    due_date: "",
  };
}

export default Invoices;