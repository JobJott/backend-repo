const express = require("express");
const router = express.Router();
const {
  requestPasswordReset,
  verifyToken,
  resetPassword,
} = require("../controllers/passwordController");

router.post("/request-reset", requestPasswordReset); // Step 3
router.get("/verify-token/:token", verifyToken); // Step 4
router.post("/reset-password", resetPassword); // Step 5

module.exports = router;
