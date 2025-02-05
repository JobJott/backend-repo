const Notification = require("../models/notification");

exports.sendNotifications = async (req, res) => {
  const { missed, upcoming } = req.body;

  try {
    const userId = req.user.id;
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));

    const notifications = [
      ...missed
        .filter((job) => new Date(job.interview?.interviewDate) >= oneWeekAgo) // Ignore old notifications
        .map((job) => ({
          jobId: job._id,
          type: "missed",
          userId,
        })),
      ...upcoming.map((job) => ({
        jobId: job._id,
        type: "upcoming",
        userId,
      })),
    ];

    for (const notification of notifications) {
      const exists = await Notification.findOne({
        userId: notification.userId,
        jobId: notification.jobId,
        type: notification.type,
      });

      if (!exists) {
        await Notification.create(notification);
      }
    }

    res.status(201).json({ message: "Notifications sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending notifications", error });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notifications as read", error });
  }
};

exports.deleteNotification = async (req, res) => {
  const { jobId } = req.params;

  try {
    const updatedNotification = await Notification.findOneAndUpdate(
      { jobId },
      { isDeleted: true },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification marked as deleted",
      notification: updatedNotification,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
      isRead: false, // Exclude deleted notifications
      isDeleted: { $ne: true },
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};
