import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { sendMailToUser } from "../utils/email.js";

dotenv.config();

//Register User
const registerUser = async (req, res) => {
  try {
    let { name, email, password, profilePic } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    password = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password,
      profilePic,
    });

    const savedUser = await user.save();

    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
      isAdmin: savedUser.isAdmin,
      token: generateToken(savedUser._id, savedUser.isAdmin),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;

  try {
    // Query the database to find the user profile data using the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user profile data as the response
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// route for the user profile editing
const editProfile = asyncHandler(async (req, res) => {
  const { name, email, profilePic, password } = req.body;
  const userId = req.userId;

  try {
    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data with provided information
    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePic) user.profilePic = profilePic;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save the updated user data
    await user.save();

    // Return the updated user data as response
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//Get User Rewards History
const getUserRewardHistory = async (req, res) => {
  try {
    const rewards = await Reward.find({ userId: req.params.id });
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let isPasswordValid = await bcrypt.compare(password, user.password);

  if (user && isPasswordValid) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      rewards: user.rewards,
      image: user.image,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      token: generateToken(user._id, user.isAdmin),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or Password");
  }
});

// function for admin login
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role == "user") {
    return res
      .status(404)
      .json({ message: "Don't have access to this account" });
  }

  let isPasswordValid = await bcrypt.compare(password, user.password);

  if (user && isPasswordValid) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      token: generateToken(user._id, user.isAdmin),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or Password");
  }
});

const authGoogle = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  const user = await User.findOne({ $or: [{ email: email }] });

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      contact: user.contact,
      token: generateToken(user._id, user.isAdmin),
    });
  } else {
    const newUser = new User({ name, email });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (users) {
    res.status(200);
    res.json({ users });
  } else {
    res.status(401);
    throw new Error("Invalid email or Password");
  }
});

// Delete All users
const deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany({});

    res.status(200).json({ message: "All users deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    sendMailToUser(
      email,
      `This is the mail for forgot password. This is your ${otp} you can use it to reset your password
      `
    );

    user.otp = otp;
    user.otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    await user.save();

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const verifyCode = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user && user.otp === otp && user.otpExpiration > Date.now()) {
    // Hash the new password

    res.status(200).json({ success: true, message: "Otp matched!" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Invalid OTP or OTP expired" });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.otp = undefined;
    user.otpExpiration = undefined;
    user.password = hashPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export {
  registerUser,
  authUser,
  authAdmin,
  getAllUsers,
  authGoogle,
  getProfile,
  editProfile,
  getUserRewardHistory,
  deleteAllUsers,
  forgotPassword,
  verifyCode,
  resetPassword,
};
