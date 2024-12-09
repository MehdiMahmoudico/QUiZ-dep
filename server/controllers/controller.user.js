const User = require("../models/model.user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");


//find all users
module.exports.findALLUser = (req, res) => {
  User.find()
    .then((User) => {
      res.json(User);   
    })
    .catch((err) => {
      res.status(400).json(err);
      
    });
};

//find one user by email
module.exports.findOneSingleUser = (req, res) => {
  User.findOne({ email: req.params.email })
    .then((oneSingleUser) => {
      res.json(oneSingleUser );
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

// find one user by id
module.exports.findOneSingleUserById = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((oneSingleUser) => {
      res.json(oneSingleUser );
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

// update user by id
module.exports.updateExistingUser = (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedUser) => {
      res.json({ User: updatedUser });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

// Register 
module.exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = await User.create({ firstName, lastName, email, password, role });
  res.status(201).json({ message: "User registered successfully", user: newUser });
});

// Login 
module.exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid email or password" });

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) return res.status(400).json({ message: "Invalid email or password" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });

  res
    .cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production",maxAge: 3600000, })
    .status(200)
    .json({ message: "Logged in successfully", user: { id: user._id, role: user.role , firstName : user.firstName},token, });
});

// Logout 
module.exports.logout = asyncHandler(async (req, res) => {
    console.log("Cookies received:", req.cookies);
  res.clearCookie("access_token").status(200).json({ message: "Logged out successfully" });
});
