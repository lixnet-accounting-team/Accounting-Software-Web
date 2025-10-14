import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user")); // get logged in user
  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
