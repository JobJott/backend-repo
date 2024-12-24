const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Link to the user who submitted the application
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    URL: {
      type: String,
    },
    companyName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    jobDescription: {
      type: String,
    },
  },
  { timestamps: true }
);
const jobApplication = mongoose.model("jobApplication", jobApplicationSchema);

module.exports = jobApplication;
