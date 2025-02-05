  const mongoose = require("mongoose");

  const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    type: { type: String, required: true, enum: ["missed", "upcoming"] },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  });
  notificationSchema.index({ userId: 1, jobId: 1, type: 1 }, { unique: true });

  const Notification = mongoose.model("Notification", notificationSchema);

  module.exports = Notification;
