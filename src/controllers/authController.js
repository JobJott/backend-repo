// This file handles user sign-up (registration) and log-in functionality. When a user registers, it checks if they already exist, creates a new user, and generates a token for secure access. When a user logs in, it checks their credentials (email and password), and if valid, generates a token for secure access.

const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Enable or disable debug logs
const DEBUG = true;

// Function to get the current timestamp
const getTimeStamp = () => {
  return new Date().toISOString(); // Returns the current timestamp in ISO 8601 format
};

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

    if (DEBUG) console.log("Generated Token:", token);

    // Respond with the user data and their token, user created successfully
    res
      .status(201)
      .json({ user: { firstName, lastName, email }, token, refreshToken });
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
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Debug log with timestamp
    if (DEBUG) {
      console.log(`[${getTimeStamp()}] Generated Token:`, token);
      console.log(`[${getTimeStamp()}] Generated Refresh Token:`, refreshToken);
    }

    // Respond with the user data and their token
    res.status(200).json({
      token,
      refreshToken,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error }); // handle unexpected error
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const token = req.headers["x-refresh-token"];

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Debug log with timestamp
    if (DEBUG) {
      console.log(
        `[${getTimeStamp()}] Generated New Token for Refresh:`,
        newToken
      );
    }

    res.status(200).json({ token: newToken });
  } catch (error) {
    res
      .status(403)
      .json({ message: "Invalid or expired refresh token", error });
  }
};

module.exports = { registerUser, loginUser, refreshToken };
