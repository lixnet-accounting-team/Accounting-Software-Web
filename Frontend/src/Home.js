// src/Dashboard.js
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { FaFileInvoiceDollar, FaMoneyBillWave, FaUserFriends } from "react-icons/fa";

/**
 * Dashboard component
 * - Accepts optional prop `onSelectPage` for state-driven navigation.
 * - Falls back to react-router navigate(...) if onSelectPage not provided.
 * - Quick actions will request the target module to open its "Add" modal by writing
 *   sessionStorage.open_add = 'invoices' | 'expenses' | 'customers' before navigating.
 */
function Dashboard({ onSelectPage }) {
  const [report, setReport] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line
  }, []);

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      // Primary aggregate report
      const rptRes = await fetch(
        "http://localhost/accounting-software/Backend/api/reports.php",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (rptRes.ok) {
        const rptJson = await rptRes.json().catch(() => ({}));
        if (rptJson && rptJson.success && rptJson.report) {
          setReport(rptJson.report);
        } else if (rptJson && rptJson.report) {
          setReport(rptJson.report);
        } else if (rptJson && typeof rptJson === "object") {
          setReport(rptJson.report || rptJson);
        } else {
          setReport(null);
        }
      } else {
        try {
          const txt = await rptRes.text();
          console.warn("reports.php returned non-OK:", txt);
        } catch {}
        setReport(null);
      }

      // Recent invoices (best-effort)
      try {
        const invRes = await fetch(
          "http://localhost/accounting-software/Backend/api/invoices.php?limit=10",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        if (invRes.ok) {
          const invJson = await invRes.json().catch(() => []);
          setRecentInvoices(invJson.invoices || invJson.data || invJson || []);
        }
      } catch (e) {
        console.warn("Failed to fetch recent invoices (non-fatal)", e);
      }

      // Recent expenses (best-effort)
      try {
        const expRes = await fetch(
          "http://localhost/accounting-software/Backend/api/expenses.php?limit=5",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        if (expRes.ok) {
          const expJson = await expRes.json().catch(() => []);
          setRecentExpenses(expJson.expenses || expJson.data || expJson || []);
        }
      } catch (e) {
        console.warn("Failed to fetch recent expenses (non-fatal)", e);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value) {
    return `KSh ${Number(value || 0).toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // IMPORTANT: choose the **bottom-most** month as "this month" (last array element)
  const monthlyTrend = Array.isArray(report?.monthly_trend) ? report.monthly_trend : [];
  const thisMonthEntry = monthlyTrend.length > 0 ? monthlyTrend[monthlyTrend.length - 1] : null;

  const thisMonthRevenue = thisMonthEntry ? Number(thisMonthEntry.revenue || 0) : (report?.profit_loss?.total_revenue || 0);
  const thisMonthExpenses = thisMonthEntry ? Number(thisMonthEntry.expenses || 0) : (report?.profit_loss?.total_expenses || 0);
  const thisMonthProfit = thisMonthRevenue - thisMonthExpenses;

  const totalCustomers = report?.customers?.total_customers ?? report?.customers_total ?? 0;

  // Trend series (take up to 6 months in chronological order from newest->older if present)
  // We'll present them from newest (index 0) down; sparkline will plot in that same order.
  const trend = monthlyTrend.slice(-6); // keep last 6 (older to newest)
  // For sparkline plotting we want an array from older -> newer, so ensure order:
  const trendOrdered = Array.isArray(trend) ? trend : [];
  const revenueSeries = trendOrdered.map(t => Number(t.revenue || 0));
  const expenseSeries = trendOrdered.map(t => Number(t.expenses || 0));
  const maxValue = Math.max(...revenueSeries, ...expenseSeries, 1);

  // Expenses by category
  const categories = Array.isArray(report?.expenses_by_category) ? report.expenses_by_category : [];

  function sparklinePoints(series, width = 180, height = 40) {
    if (!series || series.length === 0) return "";
    const step = width / Math.max(1, series.length - 1);
    return series.map((v, i) => {
      const x = Math.round(i * step);
      const y = Math.round(height - (v / maxValue) * height);
      return `${x},${y}`;
    }).join(" ");
  }

  // Hybrid navigation helper: prefer onSelectPage (state-driven), fallback to router navigate
  // Additionally set a sessionStorage key so the destination module auto-opens its Add modal.
  function goToAndOpenAdd(pageKey, routeFallback) {
    // write the intended module so the target page opens its add modal
    try {
      sessionStorage.setItem("open_add", pageKey);
    } catch (e) {
      console.warn("sessionStorage.setItem failed", e);
    }

    if (typeof onSelectPage === "function") {
      try {
        onSelectPage(pageKey);
        return;
      } catch (e) {
        console.warn("onSelectPage failed, falling back to navigate()", e);
      }
    }
    if (routeFallback) navigate(routeFallback);
  }

  // Force recent invoices to display as PAID (green) per your requirement
  const renderInvoiceStatus = () => (
    <div className="status status-paid">PAID</div>
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <p className="muted">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-actions">
          <button className="btn btn-primary" onClick={() => goToAndOpenAdd("invoices", "/invoices")}>
            <FaFileInvoiceDollar /> Create New Invoice
          </button>
          <button className="btn" onClick={() => goToAndOpenAdd("expenses", "/expenses")}>
            <FaMoneyBillWave /> Add Expense
          </button>
          <button className="btn" onClick={() => goToAndOpenAdd("customers", "/customers")}>
            <FaUserFriends /> Add Customer
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="hero-grid">
        <div className="hero-card">
          <div className="hero-label">Total Revenue (This Month)</div>
          <div className="hero-value">{formatCurrency(thisMonthRevenue)}</div>
        </div>

        <div className="hero-card">
          <div className="hero-label">Total Expenses (This Month)</div>
          <div className="hero-value">{formatCurrency(thisMonthExpenses)}</div>
        </div>

        <div className="hero-card">
          <div className="hero-label">Net {thisMonthProfit >= 0 ? "Profit" : "Loss"} (This Month)</div>
          <div
            className="hero-value"
            style={{ color: thisMonthProfit >= 0 ? "#2e7d32" : "#c62828" }}
          >
            {thisMonthProfit >= 0 ? "+" : "-"}{formatCurrency(Math.abs(thisMonthProfit))}
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-label">Total Customers</div>
          <div className="hero-value">{totalCustomers}</div>
        </div>
      </div>

      {/* Middle: Activity + Charts */}
      <div className="mid-grid">
        <div className="card activity-card">
          <h3>Quick Activity</h3>

          <div className="activity-section">
            <h4>Recent Invoices</h4>
            {Array.isArray(recentInvoices) && recentInvoices.length > 0 ? (
              <ul className="list-compact">
                {recentInvoices.slice(0, 10).map((inv, idx) => (
                  <li key={idx} className="list-item">
                    <div className="list-left">
                      <div className="item-title">{inv.invoice_no || inv.number || `INV-${inv.id || (idx+1)}`}</div>
                      <div className="item-sub muted">{inv.customer_name || inv.customer || "Unknown customer"}</div>
                    </div>
                    <div className="list-right">
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        {renderInvoiceStatus()}
                        <div className="muted">{formatCurrency(inv.total || inv.amount || inv.total_amount)}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No recent invoices available</p>
            )}
          </div>

          <div className="activity-section">
            <h4>Recent Expenses</h4>
            {Array.isArray(recentExpenses) && recentExpenses.length > 0 ? (
              <ul className="list-compact">
                {recentExpenses.slice(0, 5).map((ex, idx) => (
                  <li key={idx} className="list-item">
                    <div className="list-left">
                      <div className="item-title">{ex.title || ex.description || ex.category || `Expense ${idx+1}`}</div>
                      <div className="item-sub muted">{ex.category || "Uncategorized"}</div>
                    </div>
                    <div className="list-right">
                      <div className="muted">{formatCurrency(ex.amount || ex.total || 0)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">No recent expenses available</p>
            )}
          </div>
        </div>

        <div className="card charts-card">
          <h3>Mini Charts</h3>
          <div className="mini-chart">
            <div className="chart-title">Revenue vs Expenses (last {trendOrdered.length} months)</div>
            <svg viewBox={`0 0 180 40`} width="100%" height="40" className="sparkline">
              <polyline
                fill="none"
                stroke="#c62828"
                strokeWidth="2"
                points={sparklinePoints(expenseSeries, 180, 40)}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
              <polyline
                fill="none"
                stroke="#2e7d32"
                strokeWidth="2"
                points={sparklinePoints(revenueSeries, 180, 40)}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
              />
            </svg>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot green" />Revenue</span>
              <span className="legend-item"><span className="legend-dot red" />Expenses</span>
            </div>
          </div>

          <div className="mini-chart">
            <div className="chart-title">Expenses by Category</div>
            {categories.length > 0 ? (
              <div className="bars-list">
                {categories.slice(0, 6).map((c, i) => {
                  const total = Number(c.total_amount || c.amount || 0);
                  const pct = (report?.profit_loss?.total_expenses && report.profit_loss.total_expenses > 0)
                    ? Math.round((total / report.profit_loss.total_expenses) * 100)
                    : 0;
                  return (
                    <div className="bar-row" key={i}>
                      <div className="bar-label">{c.category || c.name || "Uncategorized"}</div>
                      <div className="bar-wrap">
                        <div className="bar-fill" style={{ width: `${Math.max(3, pct)}%` }} />
                      </div>
                      <div className="bar-value muted">{formatCurrency(total)}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="muted">No category data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Pending/Overdue & Quick Actions */}
      <div className="bottom-grid">
        <div className="card">
          <h3>Pending / Overdue Invoices</h3>
          <p className="muted">No pending invoices</p>
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="btn btn-primary wide" onClick={() => goToAndOpenAdd("invoices", "/invoices")}><FaFileInvoiceDollar /> Create New Invoice</button>
            <button className="btn wide" onClick={() => goToAndOpenAdd("expenses", "/expenses")}><FaMoneyBillWave /> Add Expense</button>
            <button className="btn wide" onClick={() => goToAndOpenAdd("customers", "/customers")}><FaUserFriends /> Add Customer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
