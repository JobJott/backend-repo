const Goal = require("../models/goals");

exports.createGoal = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const goalData = { ...req.body, userId }; // Ensure the body contains the goal data

    const goal = new Goal(goalData);
    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGoal = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const goal = await Goal.findOne({ userId });
    res.status(200).json(goal || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const goalId = req.params.goalId; // Retrieve goalId from URL params

    const updatedGoal = await Goal.findOneAndUpdate(
      { userId, _id: goalId },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedGoal) {
      return res.status(404).json({ error: "Goal not found." });
    }
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
