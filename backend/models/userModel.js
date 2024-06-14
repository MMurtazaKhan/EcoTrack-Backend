import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    profilePic: {
      type: String,
      default: null,
    },
    virtualCoins: {
      type: Number,
      default: 0,
    },
    companyName: {
      type: String,
      default: false,
    },

    role: {
      type: String,
      default: "user",
    },

    rewardHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reward" }],

    otp: String,
    otpExpiration: Date,
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model("User", userSchema);

export default User;

// $2a$10$qN9VVI1pUkQyBh3BmEiP7.TXUAvLMoK5ysJ1Z/hqoXjCrn15uSnzi

// $2a$10$Ezaw95ir4yWQND2RMF54qO5lvT8YA1tfPzW/tSd2bNPXLdTaPmnhO
