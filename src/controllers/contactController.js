const Contact = require("../models/contact");

//Add a new contact
exports.addContact = async (req, res) => {
  try {
    const newContact = new Contact({
      ...req.body,
      userId: req.user.id,
    });
    await newContact.save();
    res
      .status(201)
      .json({ message: "contact added successfully", contact: newContact });
  } catch (error) {
    res.status(500).json({ message: "Error adding contact", error });
  }
};

// Update an existing contact
exports.updateContact = async (req, res) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      return res
        .status(404)
        .json({ message: "Contact not found or not authorized" });
    }

    res.status(200).json({
      message: "Contact updated successfully",
      contact: updatedContact,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating contact", error });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts", error });
  }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedContact) {
      return res
        .status(404)
        .json({ message: "Contact not found or not authorized" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact", error });
  }
};
