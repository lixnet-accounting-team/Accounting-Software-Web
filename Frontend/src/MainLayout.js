// src/MainLayout.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import HomeContent from "./Home"; // dashboard content
import Customers from "./Customers";
import Expenses from "./Expenses";
import Invoices from "./Invoices";
import Reports from "./Reports";

function MainLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <HomeContent />;
      case "customers":
        return <Customers sidebarCollapsed={sidebarCollapsed} />;
      case "expenses":
        return <Expenses />;
      case "invoices":
        return <Invoices />;
      case "reports":
        return <Reports />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className="app-container" style={{ display: "flex", width: "100%" }}>
      <Sidebar
        onSelectPage={setActivePage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}
        style={{ flex: 1, padding: "20px", minHeight: "100vh" }}
      >
        {renderPage()}
      </main>
    </div>
  );
}

export default MainLayout;
