const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/controller.user");
const { verifyToken, isAdmin } = require("../middleware/middleware.user");
const passport = require("../config/passport-setup");
const jwt = require("jsonwebtoken");

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    const redirectUrl = `http://localhost:3000/google-callback?` +
    `token=${token}` +
    `&userId=${req.user._id}` +
    `&userName=${req.user.firstName}` +
    `&userRole=${req.user.role}`;

  res.redirect(redirectUrl);
} 
  
);

// Protected Routes
router.post("/logout", verifyToken, logout);

router.get("/admin", [verifyToken, isAdmin], (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});


module.exports = router;