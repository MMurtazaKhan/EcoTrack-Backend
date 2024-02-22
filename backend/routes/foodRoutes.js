import express from "express";
import {
  getCarbonFootprint
} from "../controllers/foodController.js";


const router = express.Router();

router.route("/").post(getCarbonFootprint);

export default router;
