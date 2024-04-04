import express from "express";
import { getAllRewards, getUserRewardHistory } from "../controllers/rewardController.js";
const router = express.Router()

router.route('/').get(getAllRewards)
router.route('/:userId').get(getUserRewardHistory)

export default router