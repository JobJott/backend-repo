// This file handles the routes for user authentication, including updating, getting, finding and deleting user profile.

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authValidation");

// get user profile
router.get("/profile", verifyToken, userController.getUserProfile);

// update user profile
router.put("/profile", verifyToken, userController.updateUserProfile);

// delete user profile
router.delete("/profile", verifyToken, userController.deleteUserProfile);

// get all users
router.get("/", verifyToken, userController.getAllUsers);

//get user by id
router.get("/:id", verifyToken, userController.getSingleUser);

module.exports = router;
