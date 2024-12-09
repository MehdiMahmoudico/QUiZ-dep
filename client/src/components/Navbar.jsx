//import { UserContext } from "./UserContext";
import React, { useContext } from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
const Navbar = () => {
  const { isAuthenticated, username, logout, isAdmin } = useContext(AuthContext); // use the context
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // handle logout
  const handleLogout = () => {
    logout();
    navigate("/"); //
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <QuizIcon
                  sx={{ marginRight: 1, fontSize: 35, color: "yellow" }}
                />
                The Developer’s Language Mastery Quiz
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
              }}
            >
              {isAuthenticated ? (
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  sx={{
                    marginRight: 2,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  Welcome, {username}!
                </Typography>
              ):(
                <></>
              )}

              {isAuthenticated && isAdmin ? (
                <Button
                  variant="text"
                  color="inherit"
                  component={Link}
                  to="/admin/dashboard"
                >
                  Dashboard
                </Button>
              ) : (
                <></>
              )}

              {isAuthenticated ? (
                <>
                  <Button
                    variant="text"
                    color="inherit"
                    component={Link}
                    to="/main"
                  >
                    Quizzes
                  </Button>
                  <Button
                    sx={{
                      color: isActive("/stats") ? "yellow" : "white",
                      fontWeight: isActive("/stats") ? "bold" : "normal",
                      borderBottom: isActive("/stats")
                        ? "2px solid yellow"
                        : "none",
                    }}
                    component={Link}
                    to="/stats"
                  >
                    Stats
                  </Button>
                  <Button variant="text" color="inherit" onClick={handleLogout}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    sx={{
                      color:
                        isActive("/login") || isActive("/")
                          ? "yellow"
                          : "white",
                      fontWeight: isActive("/login") ? "bold" : "normal",
                      borderBottom:
                        isActive("/login") || isActive("/")
                          ? "2px solid yellow"
                          : "none",
                    }}
                    component={Link}
                    to="/login"
                  >
                    Log In
                  </Button>
                  <Button
                    sx={{
                      color: isActive("/register") ? "yellow" : "white",
                      fontWeight: isActive("/register") ? "bold" : "normal",
                      borderBottom: isActive("/register")
                        ? "2px solid yellow"
                        : "none",
                    }}
                    component={Link}
                    to="/register"
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default Navbar;
