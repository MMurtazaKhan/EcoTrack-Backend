import Emission from "../models/emissionModel.js";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

dotenv.config();

// route for the user registration route
const addEmission = asyncHandler(async (req, res) => {
  try {
    const newEmission = await Emission.create(req.body);

    return res.status(201).json(newEmission);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
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
