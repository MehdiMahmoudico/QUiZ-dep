const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { auth } = require("express-openid-connect");
const session = require('express-session');
const passport = require('./config/passport-setup');
require("dotenv").config();
require("./config/mongoose.config");

const userRoutes = require("./routes/routes.user");
const path = require('path');
const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json(), express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000'  ,methods: 'GET,POST,PUT,DELETE,PATCH',}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Session middleware (required for Passport)
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

// Routes
app.use("/api/users", userRoutes);
const AllMyQuizRoutes = require("./routes/routes.quiz");
AllMyQuizRoutes(app);


// Start Server
app.listen(port, () => console.log(`Listening on port: ${port}`));
