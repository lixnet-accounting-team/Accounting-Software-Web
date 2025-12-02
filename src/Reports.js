import React, { useEffect, useRef, useState } from "react";
import "./Reports.css";

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState({
    start_date: "",
    end_date: ""
  });
  const [filterApplied, setFilterApplied] = useState(false);

  const token = localStorage.getItem("token");

  // Refs to measure header height and set container padding so sticky header doesn't overlap
  const headerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line
  }, []);

  // Recalculate top padding whenever header/content changes
  useEffect(() => {
    function adjustHeaderHeight() {
      // allow reflow for wrapped header elements
      setTimeout(() => {
        if (headerRef.current && containerRef.current) {
          const h = headerRef.current.offsetHeight;
          // Set both a CSS var (fallback) and explicit padding-top (robust)
          containerRef.current.style.setProperty("--reports-header-height", `${h}px`);
          containerRef.current.style.paddingTop = `${h}px`;
        }
      }, 40);
    }

    adjustHeaderHeight();

    window.addEventListener("resize", adjustHeaderHeight);
    return () => window.removeEventListener("resize", adjustHeaderHeight);
  }, [report, filterApplied, dateRange.start_date, dateRange.end_date]);

  async function loadReport(useFilter = false) {
    setLoading(true);
    setError("");
    
    let url = "http://localhost/accounting-software/Backend/api/reports.php";
    
    // Add date filters if applied
    if (useFilter && dateRange.start_date && dateRange.end_date) {
      url += `?start_date=${dateRange.start_date}&end_date=${dateRange.end_date}`;
    }

    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      
      if (!res.ok) throw new Error("Failed to fetch report");
      
      const data = await res.json();
      
      if (data.success) {
        setReport(data.report);
        setFilterApplied(useFilter);
      } else {
        setError(data.error || "Failed to load report");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while fetching report");
    } finally {
      setLoading(false);
    }
  }

  function handleApplyFilter() {
    if (!dateRange.start_date || !dateRange.end_date) {
      alert("Please select both start and end dates");
      return;
    }
    loadReport(true);
  }

  function handleClearFilter() {
    setDateRange({ start_date: "", end_date: "" });
    setFilterApplied(false);
    loadReport(false);
  }

  function formatCurrency(amount) {
    return `KSh ${Number(amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function formatMonth(monthStr) {
    if (!monthStr) return "";
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  if (loading) {
    return (
      <div className="reports-container" ref={containerRef}>
        <div className="reports-header" ref={headerRef}>
          <h2 className="reports-title">Business Reports</h2>
        </div>
        <p style={{ padding: 20, textAlign: "center" }}>Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-container" ref={containerRef}>
        <div className="reports-header" ref={headerRef}>
          <h2 className="reports-title">Business Reports</h2>
        </div>
        <p className="error" style={{ padding: 20, textAlign: "center" }}>{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="reports-container" ref={containerRef}>
        <div className="reports-header" ref={headerRef}>
          <h2 className="reports-title">Business Reports</h2>
        </div>
        <p style={{ padding: 20, textAlign: "center" }}>No report data available</p>
      </div>
    );
  }

  const profitLoss = report.profit_loss || {};
  const isProfit = (profitLoss.net_profit || 0) >= 0;

  // explicit color constants to ensure they render regardless of other rules
  const profitColor = "#2e7d32";
  const lossColor = "#c62828";

  return (
    <div className="reports-container" ref={containerRef}>
      <div className="reports-header" ref={headerRef}>
        <h2 className="reports-title">Business Reports</h2>
        
        <div className="date-filter">
          <input
            type="date"
            className="date-input"
            value={dateRange.start_date}
            onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value }))}
          />
          <span className="date-separator">to</span>
          <input
            type="date"
            className="date-input"
            value={dateRange.end_date}
            onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value }))}
          />
          <button className="btn-apply-filter" onClick={handleApplyFilter}>
            Apply Filter
          </button>
          {filterApplied && (
            <button className="btn-clear-filter" onClick={handleClearFilter}>
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {filterApplied && (
        <div className="filter-badge">
          Showing data from {dateRange.start_date} to {dateRange.end_date}
        </div>
      )}

      {/* Profit & Loss Section */}
      <div className="report-section">
        <h3 className="section-title">📊 Profit & Loss Statement</h3>
        <div className="stats-grid-3">
          <div className="stat-card revenue">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">{formatCurrency(profitLoss.total_revenue)}</div>
            <div className="stat-sublabel">{report.invoices?.total_invoices || 0} Invoices</div>
          </div>
          
          <div className="stat-card expenses">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value">{formatCurrency(profitLoss.total_expenses)}</div>
            <div className="stat-sublabel">{report.expenses?.total_expenses || 0} Transactions</div>
          </div>
          
          <div className={`stat-card ${isProfit ? 'profit' : 'loss'}`}>
            <div className="stat-label">Net {isProfit ? 'Profit' : 'Loss'}</div>
            {/* inline styling to force color */}
            <div
              className="stat-value"
              style={{ color: isProfit ? profitColor : lossColor }}
            >
              {isProfit ? '+' : '-'}
              {formatCurrency(Math.abs(profitLoss.net_profit || 0))}
            </div>
            <div className="stat-sublabel">
              Margin: {profitLoss.profit_margin ?? 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="report-section">
        <h3 className="section-title">📈 Quick Statistics</h3>
        <div className="stats-grid-4">
          <div className="stat-card-small">
            <div className="stat-small-label">Total Customers</div>
            <div className="stat-small-value">{report.customers?.total_customers || 0}</div>
          </div>
          
          <div className="stat-card-small">
            <div className="stat-small-label">Total Users</div>
            <div className="stat-small-value">{report.users?.total_users || 0}</div>
          </div>
          
          <div className="stat-card-small">
            <div className="stat-small-label">Avg Invoice Value</div>
            <div className="stat-small-value">
              {formatCurrency(
                report.invoices?.total_invoices > 0 
                  ? (profitLoss.total_revenue || 0) / report.invoices.total_invoices 
                  : 0
              )}
            </div>
          </div>
          
          <div className="stat-card-small">
            <div className="stat-small-label">Avg Expense</div>
            <div className="stat-small-value">
              {formatCurrency(
                report.expenses?.total_expenses > 0 
                  ? (profitLoss.total_expenses || 0) / report.expenses.total_expenses 
                  : 0
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend Section */}
      {report.monthly_trend && report.monthly_trend.length > 0 && (
        <div className="report-section">
          <h3 className="section-title">📅 Monthly Trend (Last 6 Months)</h3>
          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th className="right">Revenue</th>
                  <th className="right">Expenses</th>
                  <th className="right">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {report.monthly_trend.map((row, idx) => {
                  const monthProfit = row.profit || 0;
                  const isProfitMonth = monthProfit >= 0;
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'row-light' : 'row-dark'}>
                      <td>{formatMonth(row.month)}</td>
                      <td className="right">{formatCurrency(row.revenue)}</td>
                      <td className="right">{formatCurrency(row.expenses)}</td>
                      <td
                        className="right"
                        style={{ color: isProfitMonth ? profitColor : lossColor, fontWeight: 600 }}
                      >
                        {isProfitMonth ? '+' : '-'}
                        {formatCurrency(Math.abs(monthProfit))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses by Category Section */}
      {report.expenses_by_category && report.expenses_by_category.length > 0 && (
        <div className="report-section">
          <h3 className="section-title">💰 Expenses by Category</h3>
          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th className="right">Total Amount</th>
                  <th className="right">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {report.expenses_by_category.map((row, idx) => {
                  const percentage = (profitLoss.total_expenses || 0) > 0 
                    ? ((row.total_amount / profitLoss.total_expenses) * 100).toFixed(1)
                    : 0;
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'row-light' : 'row-dark'}>
                      <td>{row.category || 'Uncategorized'}</td>
                      <td className="right">{formatCurrency(row.total_amount)}</td>
                      <td className="right">{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Customers Section */}
      {report.top_customers && report.top_customers.length > 0 && (
        <div className="report-section">
          <h3 className="section-title">🏆 Top 5 Customers by Revenue</h3>
          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th className="right">Invoices</th>
                  <th className="right">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {report.top_customers.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'row-light' : 'row-dark'}>
                    <td>{row.name}</td>
                    <td className="right">{row.invoice_count}</td>
                    <td className="right">{formatCurrency(row.total_spent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
