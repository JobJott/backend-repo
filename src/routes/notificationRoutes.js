const express = require("express");
const {
  sendNotifications,
  markAsRead,
  deleteNotification,
  getNotifications,
} = require("../controllers/notificationController");
const authValidation = require("../middleware/authValidation");

const router = express.Router();

router.post("/send", authValidation, sendNotifications);
router.post("/mark-read", authValidation, markAsRead);
router.delete("/:jobId", authValidation, deleteNotification);
router.get("/", authValidation, getNotifications);

module.exports = router;
