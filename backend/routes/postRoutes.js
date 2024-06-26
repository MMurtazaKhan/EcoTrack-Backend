import express from "express";
import {
  LikePost,
  addComment,
  addPost,
  deleteAllPosts,
  deletePost,
  getAllPosts,
  getSpecificPost,
  getUserPosts,
  postAds,
  getAllMyAds,
  // deleteAd,
} from "../controllers/postControllers.js";
import { authenticateUser } from "../middleware/error.js";

const router = express.Router();

router.route("/").get(getAllPosts);
router.route("/advertisement").get(getAllMyAds);
// router.route("advertisement/:postId").delete(authenticateUser, deleteAd);

router.route("/add").post(authenticateUser, addPost);
router.route("/postAd").post(authenticateUser, postAds);
router.route("/:postId/comments").put(addComment);
router.route("/:postId/like").put(LikePost);
router.route("/:postId").get(getSpecificPost);
router.route("/:postId").delete(authenticateUser, deletePost);

// router.route('/').delete(authenticateUser, deleteAllPosts)
router.route("/user/:userId").get(getUserPosts);

export default router;
