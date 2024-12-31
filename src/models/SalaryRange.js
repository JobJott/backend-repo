const mongoose = require("mongoose");

const salaryRangeSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "jobApplication",
      required: true,
    },
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    currency: { type: String },
    payPeriod: {
      type: String,
      enum: ["Monthly", "Yearly", "Weekly"],
    },
  },
  { timestamps: true }
);

const SalaryRange = mongoose.model("SalaryRange", salaryRangeSchema);

module.exports = SalaryRange;
