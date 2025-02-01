const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const _ = require("lodash");
const authenticateToken = require("../middleware/authMiddleware");
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser) {
      if (_.get(existingUser, "email", "Not Found") == email) {
        return res.status(400).json({ message: "Email already exists" });
      }

      if (_.get(existingUser, "username", "Not Found") == username) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log("\nRegistration Error: ", err);
    res.status(500).json({ message: "Ineternal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    console.log("\nLog in Error: ", err);
    res.status(500).json({ message: "Server error" });
  }
});

// protected Route
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}, this is your profile` });
});

module.exports = router;
