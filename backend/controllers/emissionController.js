import Emission from "../models/emissionModel.js";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

import { getDateOneWeekAgo } from "../utils/helper.js";

dotenv.config();

// route for the user registration route
const addEmission = asyncHandler(async (req, res) => {
  try {
    const newEmission = await Emission.create(req.body);

    return res.status(201).json({ success: true, newEmission });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getWeeklyEmissionsData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const oneWeekAgo = getDateOneWeekAgo();

  const thresholdValues = {
    meal: 6,
    transport: 14,
    food: 12,
    electricity: 10,
  };

  try {
    // Fetch emissions from the past week for the user
    const emissions = await Emission.find({
      user: id,
      createdAt: { $gte: oneWeekAgo },
    });

    // Aggregate emissions by category
    const categoryTotals = emissions.reduce((acc, emission) => {
      const { category, carbonEmitted } = emission;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += carbonEmitted;
      return acc;
    }, {});

    // Check against threshold values
    const result = Object.entries(categoryTotals).map(([category, totalEmissions]) => ({
      category,
      totalEmissions,
      exceedsThreshold: totalEmissions > thresholdValues[category],
    }));

    res.status(200).json({ result });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// route for getting all emissions
const getAllMyEmissions = asyncHandler(async (req, res) => {
  try {
    const emissions = await Emission.find({ user: req.userId });
    return res.status(200).json(emissions);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// route for getting details of single emission
const getSingleEmission = asyncHandler(async (req, res) => {
  try {
    const { emissionId } = req.query;
    const emission = await Emission.findById(emissionId);
    return res.status(200).json(emission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export { addEmission, getAllMyEmissions, getSingleEmission };
