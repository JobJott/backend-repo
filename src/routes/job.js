const express = require("express");
const router = express.Router();
const {
  addJob,
  getJobs,
  updateJob,
  deleteJob,
  getJobById,
} = require("../controllers/jobController");
const authValidation = require("../middleware/authValidation");

// Add a new job
router.post("/add", authValidation, addJob);

// Get all jobs for the logged-in user
router.get("/", authValidation, getJobs);

// Get a single job by ID
router.get("/:id", authValidation, getJobById);

// Update a job by ID
router.put("/:id", authValidation, updateJob);

// Delete a job by ID
router.delete("/:id", authValidation, deleteJob);

module.exports = router;
