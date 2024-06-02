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
export const allVouchersForUsers = asyncHandler(async (req, res) => {
  try {
    const vouchers = await Voucher.find({ disable: false });
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
