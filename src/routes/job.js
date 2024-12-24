const express = require("express");
const router = express.Router();
const { addJob } = require("../controllers/jobController");
const authValidation = require("../middleware/authValidation");

router.post("/add", authValidation, addJob);

module.exports = router;
