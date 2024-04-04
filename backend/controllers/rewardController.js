import Reward from "../models/rewardsModel.js";

export const getAllRewards = async (req, res) => {
    try {
      // Find all rewards
      const rewards = await Reward.find();
  
      res.status(200).json(rewards);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
};

export const getUserRewardHistory = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query the Reward collection to find reward entries for the user
    const rewards = await Reward.find({ userId: userId });

    res.status(200).json(rewards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};