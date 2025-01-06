const express = require("express");
const router = express.Router();
const {
  addJob,
  getJobs,
  updateJob,
  deleteJob,
  getJobById,
  addSalaryRange,
  updateSalaryRange,
  getSalaryDetails,
  updateJobStatus,
} = require("../controllers/jobController");
const authValidation = require("../middleware/authValidation");

// Salary range-related routes
router.post("/salary-range/add", authValidation, addSalaryRange); // Add salary range
router.put("/salary-range/:jobId", authValidation, updateSalaryRange); // Update salary range
router.get("/salary-range/:jobId", authValidation, getSalaryDetails); //Get salary range details for a job
router.patch("/:id/status", authValidation, updateJobStatus); //update job status

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

/**
 * Job routes handled by this router:
 * - POST /salary-range/add: Add salary range
 * - PUT /salary-range/:jobId: Update salary range
 * - GET /salary-range/:jobId: Fetch salary details for a specific job
 * - POST /add: Add a new job
 * - GET /: Get all jobs for the logged-in user
 * - GET /:id: Get a single job by ID
 * - PUT /:id: Update a job by ID
 * - PATCH /:id/status: Update job status
 * - DELETE /:id: Delete a job by ID
 */
module.exports = router;
