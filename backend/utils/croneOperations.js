import mongoose from "mongoose";
import Story from "../models/storyModel.js";
import User from '../models/userModel.js';
import Goal from '../models/goalModel.js';
import Emission from '../models/emissionsModel.js';
import Reward from '..rewardsModel.js';

export const deleteOldStories = async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const deletedStories = await Story.deleteMany({
      createdAt: { $lt: oneDayAgo },
    });

    console.log(`${deletedStories.deletedCount} stories were deleted.`);
  } catch (error) {
    console.error("Failed to delete stories:", error);
  }
};

export const checkGoalsAndAwardUsers = async () => {
  const currentDate = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const goals = await Goal.find({
    endDate: { $gte: lastMonth },
  });

  for (const goal of goals) {
    const emissions = await Emission.aggregate([
      { $match: { user: goal.userId, category: goal.category, createdAt: { $gte: lastMonth, $lte: currentDate } } },
      { $group: { _id: null, totalEmissions: { $sum: '$carbonEmitted' } } }
    ]);

    const totalEmissions = emissions[0] ? emissions[0].totalEmissions : 0;

    if (totalEmissions < goal.target) {
      goal.goalAchieved = true;
      await goal.save();

      const user = await User.findById(goal.userId);
      user.virtualCoins += 50;
      await user.save();

      const reward = new Reward({
        userId: user._id,
        action: 'goalAchieved',
        coinsEarned: 50
      });
      await reward.save();
    }
  }
};
