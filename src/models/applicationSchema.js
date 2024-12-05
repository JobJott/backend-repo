const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userProfile', // Link to the user who submitted the application
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String, // Description of the job
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected', 'Hired'],
    default: 'Applied',
  },
  interviewDate: {
    type: Date, // Date when the interview is scheduled (if applicable)
  },
  offerDetails: {
    type: String, // Details of the job offer (if applicable)
  },
  rejectionReason: {
    type: String, // Reason for rejection (if applicable)
  },
  followUp: {
    type: String, // Notes on follow-ups or reminders
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
