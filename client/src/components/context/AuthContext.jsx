// AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const[username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");
    const userId = localStorage.getItem("id");
    if (token && userName && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
      setUsername(username);
      setIsAdmin(userRole === "admin"); // Set isAdmin based on role
    }

    setLoading(false); // Set loading to false once the values are loaded
  }, []);

  // Prevent rendering children while loading
  if (loading) {
    return <div>Loading...</div>;
  }

 // logout
 const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  setIsAuthenticated(false);
  setRole("");
  setIsAdmin(false); // Reset isAdmin when logging out
};

// login
const login = (username, token, role,userId) => {
  localStorage.setItem("token", token);
  localStorage.setItem("username", username);
  localStorage.setItem("role", role);
  localStorage.setItem("userId", userId);
  setIsAuthenticated(true);
  setRole(role);
  setUsername(username);
  setIsAdmin(role === "admin"); // Set isAdmin based on role
  console.log("AuthProvider - Logged in:", { username, role, isAdmin: role === "admin" });
};
  return (
    <AuthContext.Provider value={{ isAuthenticated, role, isAdmin , username, logout,login}}>
      {children}
    </AuthContext.Provider>
  );
};
