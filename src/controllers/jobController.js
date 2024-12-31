const JobApplication = require("../models/jobApplication");
const SalaryRange = require("../models/SalaryRange");
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

// Add salary range to a job
exports.addSalaryRange = async (req, res) => {
  try {
    const { jobId, minSalary, maxSalary, currency, payPeriod } = req.body;

    if (!minSalary || !maxSalary) {
      return res.status(400).json({ message: "Salary range is required." });
    }

    const salaryRange = new SalaryRange({
      jobId,
      userId: req.user.id,
      minSalary,
      maxSalary,
      currency,
      payPeriod,
    });

    const savedSalaryRange = await salaryRange.save();
    res
      .status(201)
      .json({ message: "Salary range added successfully", savedSalaryRange });
  } catch (error) {
    console.error("Error adding salary range:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the salary range." });
  }
};

// Update salary range for a specific job
exports.updateSalaryRange = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { minSalary, maxSalary, currency, payPeriod } = req.body;

    // Validate ObjectId for jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    // Find the JobApplication associated with the jobId and check the userId
    const jobApplication = await JobApplication.findById(jobId);

    if (!jobApplication) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the current user is the owner of the job
    if (jobApplication.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this salary range" });
    }

    // Find the SalaryRange associated with the job and update it
    const updatedSalaryRange = await SalaryRange.findOneAndUpdate(
      { jobId: jobId },
      {
        $set: {
          minSalary,
          maxSalary,
          currency,
          payPeriod,
        },
      },
      { new: true }
    );

    if (!updatedSalaryRange) {
      return res
        .status(404)
        .json({ message: "Salary range not found or not authorized." });
    }

    // Return the updated job's salary range
    res.status(200).json(updatedSalaryRange);
  } catch (error) {
    console.error("Error updating salary range:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the salary range." });
  }
};

// Fetch salary details for a specific job by jobId
exports.getSalaryDetails = async (req, res) => {
  try {
    const { jobId } = req.params; // Get jobId from request params

    const salaryDetails = await SalaryRange.findOne({ jobId });

    if (!salaryDetails) {
      // If no salary range exists, return a message but allow the frontend to proceed
      return res
        .status(200)
        .json({ message: "No salary details found for this job" });
    }

    return res.status(200).json(salaryDetails);
  } catch (error) {
    console.error("Error fetching salary details:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching salary details." });
  }
};
