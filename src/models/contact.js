const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Link to the user who submitted the application
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    jobTitle: { type: String },
    companyName: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    notes: { type: String },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobApplication",
      default: null, // Allows null to indicate no associated job yet
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
