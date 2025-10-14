import React, { useEffect, useState } from "react";
import "./Expenses.css";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const apiUrl = "http://localhost/accounting-software/Backend/api/expenses.php";

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (res.ok) {
          setExpenses(Array.isArray(data) ? data : []);
        } else {
          setError(data.error || "Failed to fetch expenses");
        }
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Safe filter (won't crash if title/category missing)
  const filteredExpenses = expenses.filter((exp) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const title = exp.title ? String(exp.title).toLowerCase() : "";
    const category = exp.category ? String(exp.category).toLowerCase() : "";
    return title.includes(q) || category.includes(q);
  });

  const openAddModal = () => {
    setEditingExpense(null);
    setFormData({ title: "", amount: "", category: "", date: "", notes: "" });
    setShowAddModal(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title || "",
      amount: expense.amount || "",
      category: expense.category || "",
      date: expense.date || "",
      notes: expense.notes || "",
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingExpense(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        // Update
        await fetch(`${apiUrl}?id=${editingExpense.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Create
        await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      // Refresh from server to get canonical data & ids
      const res = await fetch(apiUrl);
      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
      closeModal();
    } catch (err) {
      console.error("Save error", err);
      alert("Failed to save. Check console.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await fetch(`${apiUrl}?id=${id}`, { method: "DELETE" });
      setExpenses((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to delete. Check console.");
    }
  };

  return (
    <div className="expenses-container">
      {/* Header (sticky) — title on left, search on right */}
      <div className="expenses-header-row">
        <h2 className="expenses-title">Expense Management</h2>

        <div className="expenses-header-controls">
          <input
            type="text"
            className="expenses-search"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && <p style={{ padding: 20 }}>Loading expenses...</p>}
      {error && <p className="error" style={{ padding: 20 }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="expenses-table-wrapper">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount (Ksh)</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>
                      No Expenses Found
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense, idx) => (
                    <tr key={expense.id ?? idx} className={idx % 2 === 0 ? "row-light" : "row-dark"}>
                      <td>{expense.title}</td>
                      <td>{expense.amount}</td>
                      <td>{expense.category}</td>
                      <td>{expense.date}</td>
                      <td>{expense.notes}</td>
                      <td>
                        <button className="btn-edit" onClick={() => openEditModal(expense)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(expense.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Floating add button (bottom-right) */}
          <button className="add-expense-btn" onClick={openAddModal}>+</button>

          {/* Modal overlay & modal (uses same classes as CSS) */}
          {showAddModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>{editingExpense ? "Edit Expense" : "Add Expense"}</h3>
                <form onSubmit={submitForm}>
                  <input name="title" value={formData.title} onChange={handleFormChange} placeholder="Title" required />
                  <input name="amount" type="number" value={formData.amount} onChange={handleFormChange} placeholder="Amount" required />
                  <input name="category" value={formData.category} onChange={handleFormChange} placeholder="Category" />
                  <input name="date" type="date" value={formData.date} onChange={handleFormChange} required />
                  <textarea name="notes" value={formData.notes} onChange={handleFormChange} placeholder="Notes" />
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button type="submit" className="modal-save-btn"> {editingExpense ? "Update" : "Add"} </button>
                    <button type="button" className="modal-cancel-btn" onClick={closeModal}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Expenses;
