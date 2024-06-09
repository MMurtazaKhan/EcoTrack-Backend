import mongoose from "mongoose";
import User from "../models/userModel.js";
import Voucher from "../models/voucherModel.js";
import asyncHandler from "express-async-handler";

// Create a new goal
export const addVoucher = asyncHandler(async (req, res) => {
  try {
    const voucher = await Voucher.create(req.body);
    return res.status(201).json(voucher);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// for user
// export const allVouchersForUsers = asyncHandler(async (req, res) => {
//   try {
//     const vouchers = await Voucher.find({ disable: false });
//     return res.status(200).json(vouchers);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// });

export const allVouchersForUsers = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Insufficient details" });
    }

    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const vouchers = await Voucher.aggregate([
      {
        $match: {
          disable: false,
        },
      },
      {
        $addFields: {
          isAvailed: {
            $in: [objectIdUserId, { $ifNull: ["$users", []] }], // This ensures $users is an array
          },
        },
      },
    ]);

    return res.status(200).json(vouchers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// for admin
export const allVouchers = asyncHandler(async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    return res.status(200).json(vouchers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export const disableVoucher = asyncHandler(async (req, res) => {
  try {
    const { voucherId } = req.query;
    const disableVoucher = await Voucher.findByIdAndUpdate(
      voucherId,
      req.body,
      { new: true }
    );
    if (!disableVoucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    return res
      .status(204)
      .json({ data: disableVoucher, message: "Voucher disabled Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const assignVoucherToUser = asyncHandler(async (req, res) => {
  try {
    const { voucherId, userId } = req.body; // Get voucherId and userId from the query parameters

    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has enough virtual coins
    if (user.virtualCoins < voucher.price) {
      return res.status(400).json({ message: "Insufficient virtual coins" });
    }

    // Subtract voucher price from user's virtual coins
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { virtualCoins: -voucher.price } }, // Use $inc to decrement virtualCoins
      { new: true }
    );

    // Push userId to the voucher's users array
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      voucherId,
      { $push: { users: userId } },
      { new: true }
    );

    if (!updatedVoucher || !updatedUser) {
      return res
        .status(400)
        .json({ message: "Failed to assign voucher to user" });
    }

    // Return success response
    return res.status(200).json({
      data: {
        voucher: updatedVoucher,
        user: updatedUser,
      },
      message: "User assigned to voucher successfully and coins deducted",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const allVouchersOfUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.query;
    const vouchers = await Voucher.find({ disable: false, users: userId });
    return res.status(200).json(vouchers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
