import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Emission from "../models/emissionModel.js";
import Post from "../models/postModel.js";

// Controller function to get all users
export const getUsers = asyncHandler(async (req, res) => {
  try {
    // Find all users
    const users = await User.find({});
    // Return the users in the response
    return res.status(200).json(users);
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Controller function to delete a user
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    // Extract user ID from the request parameters
    const userId = req.params.id;

    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);

    // Check if the user exists
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success response
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getAllUsersGoals = asyncHandler(async (req, res) => {
  // Aggregate pipeline to get all users with their goals
  const usersWithGoals = await User.aggregate([
    // Match users who have goals
    {
      $match: { _id: { $exists: true } },
    },
    // Lookup to get all goals of each user
    {
      $lookup: {
        from: "goals",
        localField: "_id",
        foreignField: "userId",
        as: "goals",
      },
    },
    // Project to reshape the output
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        contact: 1,
        isAdmin: 1,
        rewards: 1,
        goals: 1,
      },
    },
  ]);

  res.status(200).json(usersWithGoals);
});

export const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;

  // Check if the post exists
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Delete the post
  await Post.findByIdAndDelete(postId);

  res.status(200).json({ message: "Post deleted successfully" });
});

export const getAllEmissions = asyncHandler(async (req, res) => {
  // Find all emissions
  const emissions = await Emission.find().populate("user", "name email");

  // Group emissions by user
  const emissionsByUser = {};
  emissions.forEach((emission) => {
    const { _id, name, email } = emission.user;
    if (!emissionsByUser[_id]) {
      emissionsByUser[_id] = { user: { _id, name, email }, emissions: [] };
    }
    emissionsByUser[_id].emissions.push(emission);
  });

  res.status(200).json(Object.values(emissionsByUser));
});
