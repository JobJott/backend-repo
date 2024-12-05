const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, // its a way of validating email to check if it matches the regular email pattern
  },
  phone: {
    type: String,
    required: true,
  },
  resume: {
    type: String, // URL or path to the resume file
    required: true,
  },
  linkedIn: {
    type: String, 
  },
  bio: {
    type: String, 
    maxLength: 500,
  },
  jobPreferences: {
    jobTitle: {
      type: String,
      required: true,
    },
    location: {
      type: String, 
    },
    salaryExpectation: {
      type: Number, 
    },
  },
  
  // Tracks the applications submitted by the user
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application', // Reference to the Job Application model
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userProfile = mongoose.model('userProfile', userProfileSchema);

module.exports = userProfile;