const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user"); // Adjust to your User model
const { sendResetEmail } = require("../utility/emailService");

// Step 1: Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).select("email");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000; // 1 hour expiration

    user.resetToken = token;
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    // Send reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    sendResetEmail(user.email, resetLink);

    res.status(200).json({ message: "Password reset link sent." });
  } catch (error) {
    res.status(500).json({ message: "Error generating reset link.", error });
  }
};

// Step 2: Verify Token
exports.verifyToken = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    res.status(200).json({ message: "Token is valid." });
  } catch (error) {
    res.status(500).json({ message: "Error verifying token.", error });
  }
};

// Step 3: Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Check if token is valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Hash and update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password.", error });
  }
};
