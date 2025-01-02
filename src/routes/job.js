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
  getAllSalaryRanges,
  updateJobStatus,
} = require("../controllers/jobController");
const authValidation = require("../middleware/authValidation");

// Salary range-related routes
router.post("/salary-range/add", authValidation, addSalaryRange); // Add salary range
router.put("/salary-range/:jobId", authValidation, updateSalaryRange); // Update salary range
router.get("/salary-range/:jobId", authValidation, getSalaryDetails); //Fetch salary details for a specific job
router.get("/salary-ranges", authValidation, getAllSalaryRanges);

// Add a new job
router.post("/add", authValidation, addJob);

// Get all jobs for the logged-in user
router.get("/", authValidation, getJobs);

// Get a single job by ID
router.get("/:id", authValidation, getJobById);

// Update a job by ID
router.put("/:id", authValidation, updateJob);

//update job status
router.patch("/:id/status", authValidation, updateJobStatus);

// Delete a job by ID
router.delete("/:id", authValidation, deleteJob);

/**
 * Job routes handled by this router:
 * - POST /salary-range/add: Add salary range
 * - PUT /salary-range/:jobId: Update salary range
 * - GET /salary-range/:jobId: Fetch salary details for a specific job
 * - GET /salary-ranges: Get all salary ranges
 * - POST /add: Add a new job
 * - GET /: Get all jobs for the logged-in user
 * - GET /:id: Get a single job by ID
 * - PUT /:id: Update a job by ID
 * - PATCH /:id/status: Update job status
 * - DELETE /:id: Delete a job by ID
 */
module.exports = router;
