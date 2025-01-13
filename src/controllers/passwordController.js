const crypto = require("crypto");
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
    await user.save({ validateBeforeSave: false });

    // Send reset link
    const resetLink = `${process.env.CLIENT_URL}/auth/reset-password/${token}`;
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
      console.log("User not found or token expired.");
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Log the user before updating
    console.log("User found:", user);

    // Directly update the password without manually hashing it
    user.password = newPassword; // Mongoose pre-save hook will handle the hashing

    // Clear the resetToken and resetTokenExpiry
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    // Save the user with the new password
    const updatedUser = await user.save();

    // Log the updated user
    console.log("User after saving:", updatedUser);
    console.log("new hashedPassword:", newPassword);

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password.", error });
  }
};
