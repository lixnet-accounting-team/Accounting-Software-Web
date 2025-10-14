import React, { useState } from "react";
import "./Sidebar.css";
import { FaBars, FaUser, FaMoneyBill, FaFileInvoice, FaChartBar, FaSignOutAlt, FaHome } from "react-icons/fa";

function Sidebar({ onSelectPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2 className="logo">{isOpen ? "Accounting Software" : "AS"}</h2>
        <FaBars className="toggle-btn" onClick={toggleSidebar} />
      </div>

      <ul className="sidebar-menu">
        <li onClick={() => onSelectPage("dashboard")}>
          <FaHome className="icon" />
          {isOpen && <span>Dashboard</span>}
        </li>
        <li onClick={() => onSelectPage("customers")}>
          <FaUser className="icon" />
          {isOpen && <span>Customers</span>}
        </li>
        <li onClick={() => onSelectPage("expenses")}>
          <FaMoneyBill className="icon" />
          {isOpen && <span>Expenses</span>}
        </li>
        <li onClick={() => onSelectPage("invoices")}>
          <FaFileInvoice className="icon" />
          {isOpen && <span>Invoices</span>}
        </li>
        <li onClick={() => onSelectPage("reports")}>
          <FaChartBar className="icon" />
          {isOpen && <span>Reports</span>}
        </li>
        <li onClick={() => onSelectPage("logout")}>
          <FaSignOutAlt className="icon" />
          {isOpen && <span>Logout</span>}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
