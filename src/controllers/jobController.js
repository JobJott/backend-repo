const JobApplication = require("../models/jobApplication");
const mongoose = require("mongoose");

exports.addJob = async (req, res) => {
  try {
    const { jobTitle, URL, companyName, location, jobDescription } = req.body;

    if (!jobTitle || !companyName) {
      return res
        .status(400)
        .json({ message: "Job title and company name are required." });
    }

    const jobApplication = new JobApplication({
      jobTitle,
      URL,
      companyName,
      location,
      jobDescription,
      userId: req.user.id,
    });

    const savedJob = await jobApplication.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.log("Error adding job:", error);
    res.status(500).json({ message: "An error occured while adding the job." });
  }
};

// Get all jobs for a user
exports.getJobs = async (req, res) => {
  try {
    const jobs = await JobApplication.find({ userId: req.user.id }).sort({
      createdAt: -1,
    }); // Get jobs for the logged-in user
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "An error occurred while fetching jobs." });
  }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params; // Extract job ID from URL params

    const job = await JobApplication.findOne({
      _id: id,
      userId: req.user.id, // Ensure the job belongs to the authenticated user
    });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or not authorized." });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the job." });
  }
};

// Update a job by ID
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params; // Job ID from URL params
    const updatedJob = await JobApplication.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // Ensure only the job owner can update
      req.body, // New data to update
      { new: true } // Return the updated job
    );

    if (!updatedJob) {
      return res
        .status(404)
        .json({ message: "Job not found or not authorized." });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the job." });
  }
};

exports.updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate job ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }

  try {
    const updatedJob = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Failed to update job status", error });
  }
};

// Delete a job by ID
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params; // Job ID from URL params
    const deletedJob = await JobApplication.findOneAndDelete({
      _id: id,
      userId: req.user.id, // Ensure only the job owner can delete
    });

    if (!deletedJob) {
      return res
        .status(404)
        .json({ message: "Job not found or not authorized." });
    }

    res.status(200).json({ message: "Job deleted successfully." });
  } catch (error) {
    console.error("Error deleting job:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the job." });
  }
};

// salaryController.js

// Add salary range to a job
exports.addSalaryRange = async (req, res) => {
  try {
    const { jobId } = req.body;
    const { minSalary, maxSalary, currency, payPeriod } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required." });
    }

    const job = await JobApplication.findOneAndUpdate(
      { _id: jobId, userId: req.user.id },
      {
        $set: {
          "salaryRange.minSalary": minSalary,
          "salaryRange.maxSalary": maxSalary,
          "salaryRange.currency": currency,
          "salaryRange.payPeriod": payPeriod,
        },
      },
      { new: true }
    );

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or not authorized." });
    }

    res.status(200).json({ message: "Salary range added successfully.", job });
  } catch (error) {
    console.error("Error adding salary range:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Update salary range for a specific job
exports.updateSalaryRange = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { minSalary, maxSalary, currency, payPeriod } = req.body;

    const updateFields = {};
    if (minSalary) updateFields.minSalary = minSalary;
    if (maxSalary) updateFields.maxSalary = maxSalary;
    if (currency) updateFields.currency = currency;
    if (payPeriod) updateFields.payPeriod = payPeriod;

    const job = await JobApplication.findOneAndUpdate(
      { _id: jobId, userId: req.user.id },
      {
        $set: {
          "salaryRange.minSalary": updateFields.minSalary,
          "salaryRange.maxSalary": updateFields.maxSalary,
          "salaryRange.currency": updateFields.currency,
          "salaryRange.payPeriod": updateFields.payPeriod,
        },
      },
      { new: true }
    );

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or not authorized." });
    }

    res
      .status(200)
      .json({ message: "Salary range updated successfully.", job });
  } catch (error) {
    console.error("Error updating salary range:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Get salary details for a job
exports.getSalaryDetails = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await JobApplication.findOne(
      { _id: jobId, userId: req.user.id },
      { salaryRange: 1 }
    );

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or not authorized." });
    }

    res.status(200).json(job.salaryRange);
  } catch (error) {
    console.error("Error fetching salary details:", error);
    res.status(500).json({ message: "Server error." });
  }
};
