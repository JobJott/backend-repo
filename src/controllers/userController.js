require("dotenv").config();
const User = require("../models/user");
const OpenAI = require("openai");

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, password },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete User Profile
exports.deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single user
exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.generateCoverLetter = async (req, res) => {
  try {
    console.log(req.body);

    const openai = new OpenAI({
      apiKey: process.env.API_KEY, // Load the API key from the .env file
    });

    const completion = openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "user",
          content: `Generate a professional cover letter. Hope Odidi is applying for the role of ${req.body.jobTitle} at ${req.body.companyName}.`,
        },
      ],
    });

    completion.then((result) => console.log(result.choices[0].message));
    res.status(200).json({ message: "Cover letter generated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Cover letter failed" });
  }
};
