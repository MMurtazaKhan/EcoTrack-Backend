import User from "../models/userModel.js";
import Emission from '../models/emissionModel.js';
import Goal from '../models/goalModel.js';
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { sendMailToUser } from "../utils/email.js";
dotenv.config();

import Stripe from "stripe";
import Post from "../models/postModel.js";
import mongoose from "mongoose";
import Voucher from "../models/voucherModel.js";
const stripe = Stripe(process.env.SECRET_KEY);

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

    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    res.status(201).json({
      ...userWithoutPassword,
      token: generateToken(savedUser._id, savedUser.isAdmin),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//Get Specific User
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    // Query the database to find the user profile data using the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user.toObject();

    // Calculate emissions for each category for the current month
    const startOfMonth = new Date(new Date().setDate(1));
    const endOfMonth = new Date(new Date().setMonth(new Date().getMonth() + 1, 0));

    const emissionsByCategory = await Emission.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user._id),
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$carbonEmitted' }
        }
      }
    ]);

    const emissions = emissionsByCategory.reduce((acc, emission) => {
      acc[emission._id] = emission.total;
      return acc;
    }, {});

    // Calculate total emissions
    const totalEmissions = Object.values(emissions).reduce((sum, value) => sum + value, 0);

    // Fetch goals for the user where endDate is in the future and goal is not achieved
    const goals = await Goal.find({
      userId: user._id,
      endDate: { $gt: new Date() },
      goalAchieved: false
    });

    // Return the user profile data and emissions as the response
    res.json({
      ...userWithoutPassword,
      emissions,
      totalEmissions,
      goals
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// route for the user profile editing
const editProfile = asyncHandler(async (req, res) => {
  const { name, email, profilePic, password } = req.body;
  console.log("image from client is", profilePic);
  const userId = req.userId;

  try {
    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user data with provided information
    if (name) user.name = name;
    if (email) {
      if (User.findOne({ email })) {
        console.log("user already exist with this email");
        return res
          .status(500)
          .json({ message: "user already exist with this email" });
      } else {
        user.email = email;
      }
    }
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
    res.status(500).json({ message: "Internal server error", error: error });
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

//Login
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    const { password, ...userWithoutPassword } = user.toObject();

    // Calculate emissions for each category for the current month
    const startOfMonth = new Date(new Date().setDate(1));
    const endOfMonth = new Date(new Date().setMonth(new Date().getMonth() + 1, 0));

    const emissionsByCategory = await Emission.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user._id),
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$carbonEmitted' }
        }
      }
    ]);

    const emissions = emissionsByCategory.reduce((acc, emission) => {
      acc[emission._id] = emission.total;
      return acc;
    }, {});

    // Calculate total emissions
    const totalEmissions = Object.values(emissions).reduce((sum, value) => sum + value, 0);

    // Fetch goals for the user where endDate is in the future and goal is not achieved
    const goals = await Goal.find({
      userId: user._id,
      endDate: { $gt: new Date() },
      goalAchieved: false
    });

    res.json({
      ...userWithoutPassword,
      token: generateToken(user._id, user.isAdmin),
      emissions,
      totalEmissions,
      goals,
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
  const users = await User.find({ role: "user" });

  if (users.length > 0) {
    res.status(200);
    res.json(users);
  } else {
    res.status(409);
    throw new Error("No user found");
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

const payment = asyncHandler(async (req, res) => {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: "usd",
      payment_method: req.body.paymentMethodId,
      metadata: {
        company: "EcoTrack",
      },
    });

    res
      .status(200)
      .json({ success: true, client_secret: myPayment.client_secret });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const grantCredit = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.id,
      { $inc: { creditLimit: 2 } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Credit Increased" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const companyDashboard = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("userId: ", userId);
    if (!userId) {
      return res.status(400).json({ message: "Insufficient details" });
    }
    const user = await User.findById(userId);

    const stats = await Post.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: { $size: "$likes" } },
          totalComments: { $sum: { $size: "$comments" } },
        },
      },
    ]);

    const data = {
      remainingBids: user.creditLimit ? user.creditLimit : 0,
      totalLikes: stats[0] ? stats[0].totalLikes : 0,
      totalComments: stats[0] ? stats[0].totalComments : 0,
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// const companyDashboard = asyncHandler(async (req, res) => {
//   const users = await User.find({ role: "user" });

//   if (users.length > 0) {
//     res.status(200);
//     res.json(users);
//   } else {
//     res.status(409);
//     throw new Error("No user found");
//   }
// });

const adminDashboard = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("userId: ", userId);
    if (!userId) {
      return res.status(400).json({ message: "Insufficient details" });
    }
    const userCount = await User.find({ role: "user" }).count();
    const companyCount = await User.find({ role: "company" }).count();

    const voucherUsersCount = await Voucher.aggregate([
      { $unwind: "$users" },
      { $group: { _id: "$users" } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const data = {
      totalUsers: userCount ? userCount : 0,
      totalCompanies: companyCount ? companyCount : 0,
      totalVoucherUsers: voucherUsersCount[0] ? voucherUsersCount[0].count : 0,
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.log("error: ", error);
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
  payment,
  grantCredit,
  companyDashboard,
  adminDashboard,
};
