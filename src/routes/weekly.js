const express = require("express");
const router = express.Router();
const authValidation = require("../middleware/authValidation");
const { weeklyController } = require("../controllers/weeklyController");

router.get("/weekly-progress", weeklyController);

module.exports = router;
