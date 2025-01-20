const mongoose = require("mongoose");

const goalsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetGoal: {
    type: String,
    enum: [
      "Land a new job in the same career path",
      "Land a new job in a new career path",
      "Explore new career paths",
    ],
  },
  targetTitle: { type: String },
  targetDate: { type: Date },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  currency: { type: String },
});

const Goal = mongoose.model("Goal", goalsSchema);

module.exports = Goal;
