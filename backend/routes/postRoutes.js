import express from "express";
import {
  addPost,
  deletePost,
  getAllPosts,
  getUserPosts,
  updatePost,
} from "../controllers/postControllers.js";
import { authenticateUser } from "../middleware/error.js";

const router = express.Router();

router.route("/").get(getAllPosts);
router.route("/add").post(authenticateUser, addPost);
router.route("/user").get(authenticateUser, getUserPosts);
router.route("/:postId").put(authenticateUser, updatePost);
router.route("/:postId").delete(authenticateUser, deletePost);

export default router;
