import express from "express";
import { createStory, deleteStory, getAllStoriesOfUser, getUsersWithStories } from "../controllers/storyController.js";
const router = express.Router()

router.route('/').get(getUsersWithStories)
router.route('/:userId').get(getAllStoriesOfUser)
router.route('/add').post(createStory)
router.route('/').delete(deleteStory)

export default router