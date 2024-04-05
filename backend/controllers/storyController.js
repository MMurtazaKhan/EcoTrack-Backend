import Story from "../models/storyModel.js"
import User from "../models/userModel.js"

const createStory = async (req, res) => {
    const { userId, imageUrl, duration } = req.body;
  
    try {
      const newStory = new Story({ user: userId, imageUrl, type, duration });
      const savedStory = await newStory.save();
  
      res.status(201).json(savedStory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
};

const getUserStories = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const userStories = await Story.find({ user: userId }).populate('user', 'name profilePic').exec();
      res.json(userStories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
};

const deleteStory = async (req, res) => {
    const storyId = req.params.storyId;
  
    try {
      const deletedStory = await Story.findByIdAndDelete(storyId);
      if (!deletedStory) {
        return res.status(404).json({ message: 'Story not found' });
      }
      res.json({ message: 'Story deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
};
  
const getUsersWithStories = async (req, res) => {
    try {
      // Get distinct user IDs from the Story collection
      const usersWithStories = await Story.distinct('user');
  
      // Find users who have contributed stories
      const users = await User.find({ _id: { $in: usersWithStories } }, 'name profilePic');
  
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
};

const getAllStoriesOfUser = async (req, res) => {
    const userId = req.params.userId; // Assuming userId is passed in the request parameters
  
    try {
      // Find all stories of the specified user
      const userStories = await Story.find({ user: userId }).populate('user', 'name profilePic');;
  
      res.json(userStories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
};

export { createStory, getAllStoriesOfUser, getUserStories, getUsersWithStories, deleteStory };
  