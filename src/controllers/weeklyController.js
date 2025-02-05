const express = require("express");
const JobApplication = require("../models/jobApplication");

// Helper function to get the start of the week
const getStartOfWeek = () => {
  const currentDate = new Date();
  const firstDayOfWeek = currentDate.getDate() - currentDate.getDay(); // Get the first day of the current week (Sunday)
  const startOfWeek = new Date(currentDate.setDate(firstDayOfWeek));
  startOfWeek.setHours(0, 0, 0, 0); // Set to midnight to include all records from the beginning of the week
  return startOfWeek;
};

// API route to fetch weekly progress
exports.weeklyController = async (req, res) => {
  try {
    const startOfWeek = getStartOfWeek(); // Get the start of the week (Sunday at midnight)
    const endOfWeek = new Date(); // Current date and time (end of the week)

    // Query the database for job applications moved to "Applied" within the last week
    const applicationsMovedToApplied = await JobApplication.countDocuments({
      status: "Applied", // Assuming the 'status' field holds the current stage of the application
      updatedAt: {
        $gte: startOfWeek, // Applications updated from the start of the week
        $lte: endOfWeek, // Applications updated up until the current date
      },
      userId: req.user.id,
    });

    // Fetch total applied applications
    const totalApplications = await JobApplication.countDocuments({
      status: "Applied",
    });

    // Send the result as a response
    res.json({
      applicationsMovedToApplied,
      totalApplications,
    });
  } catch (error) {
    console.error("Error fetching weekly progress:", error);
    res.status(500).json({ message: "Error fetching weekly progress" });
  }
};
