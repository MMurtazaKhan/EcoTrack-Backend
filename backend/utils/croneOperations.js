import mongoose from "mongoose";
import Story from "../models/storyModel.js";

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
