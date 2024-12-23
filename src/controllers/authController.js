// This file handles user sign-up (registration) and log-in functionality. When a user registers, it checks if they already exist, creates a new user, and generates a token for secure access. When a user logs in, it checks their credentials (email and password), and if valid, generates a token for secure access.

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register user
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body; // Get user data from the request body

  // Check if any of these field is empty, if its empty throw error
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    // Check if the user already exists in the database, if the email exists already in the datbase send a error message
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // If user doesn't exist, create a new user
    const user = await User.create({ firstName, lastName, email, password });

    // Generate a token for the new user id and set the expiration for the token for 1hr, meaning the user will need to log in again after that
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Generated Token:", token);

    // Respond with the user data and their token, user created successfully
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error }); // handle unexpected error
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body; // Get login details from the request body

  // Check if any field is empty, if any is empty send an error message
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    // Check if the user exists in the database, if user.email exists in the databse send an eror message
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // This bit will be for password authentication to compare if the provided password tallys with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" }); // Send an error message if passwords don't match
    }

    // Generate a JWT for the logged-in user, also set the expiration for one hour
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Generated Token:", token);

    // Respond with the user data and their token
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error }); // handle unexpected error
  }
};

module.exports = { registerUser, loginUser };
