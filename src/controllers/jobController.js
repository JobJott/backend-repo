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
