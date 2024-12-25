const JobApplication = require("../models/jobApplication");

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
