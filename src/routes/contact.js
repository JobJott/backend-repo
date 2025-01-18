const express = require("express");
const router = express.Router();
const {
  addContact,
  getAllContacts,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const authValidation = require("../middleware/authValidation");

router.post("/add", authValidation, addContact);
router.get("/", authValidation, getAllContacts);
router.put("/:id", authValidation, updateContact);
router.delete("/:id", authValidation, deleteContact);

module.exports = router;
