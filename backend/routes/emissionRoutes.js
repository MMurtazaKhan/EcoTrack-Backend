import express from "express";
import {
  addEmission,
  getAllMyEmissions,
  getSingleEmission,
  getWeeklyEmissionsData,
} from "../controllers/emissionController.js";
import { authenticateUser } from "../middleware/error.js";

const router = express.Router();

router.route("/addEmission").post(authenticateUser, addEmission);
router.get('/weekly/:id', authenticateUser, getWeeklyEmissionsData);
router.route("/:id").get(authenticateUser, getAllMyEmissions);
router.route("/").get(authenticateUser, getSingleEmission);

export default router;
