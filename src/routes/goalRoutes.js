const express = require("express");
const router = express.Router();
const goalController = require("../controllers/goalController");
const authValidation = require("../middleware/authValidation");

router.post("/add", authValidation, goalController.createGoal);
router.get("/", authValidation, goalController.getGoal);
router.put("/:goalId", authValidation, goalController.updateGoal);

module.exports = router;
