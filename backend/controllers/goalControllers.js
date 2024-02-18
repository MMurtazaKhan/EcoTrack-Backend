// Import Goal model
import Goal from '../models/goalModel.js';
import asyncHandler from "express-async-handler";

// Create a new goal
export const createGoal = asyncHandler(async (req, res) => {
  try {
    const {category, goalValue, goalDate } = req.body;
    const userId = req.userId
    const newGoal = await Goal.create({ userId, category, goalValue, goalDate });
    return res.status(201).json(newGoal);
  } catch (error) {
    return res.json({ message: error.message });
    // return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all goals for a user
export const getGoals = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const goals = await Goal.find({ userId });
    return res.status(200).json(goals);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
})

// Get a goal by ID
export const getGoalById = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const goal = await Goal.findOne({ _id: req.params.id, userId });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    return res.status(200).json(goal);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
})

// Update a goal
export const updateGoal = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const { category, goalValue, goalDate } = req.body;
    const updatedGoal = await Goal.findOneAndUpdate({ _id: req.params.id, userId }, { category, goalValue, goalDate }, { new: true });
    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    return res.status(200).json(updatedGoal);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
})

// Delete a goal
export const deleteGoal = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const deletedGoal = await Goal.findOneAndDelete({ _id: req.params.id, userId });
    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    return res.status(204).json({message: 'Goal Deleted Successfully'}); // No content on successful deletion
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
})
