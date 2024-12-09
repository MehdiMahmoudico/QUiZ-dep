// Adminroute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Adminroute = ({ children }) => {
  const { isAuthenticated, role, isAdmin } = useContext(AuthContext);

  console.log("Adminroute - isAuthenticated:", isAuthenticated, "role:", role, "isAdmin:", isAdmin);

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }

  return children; // Return children if user is admin
};

export default Adminroute;
