import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Reward from "../models/rewardsModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";

dotenv.config();

// Add a Single Post
const addPost = async (req, res) => {
  const { userId, image, postDescription } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Award virtual coins to user
    user.virtualCoins += 1; // Example: Award 1 coin per post
    await user.save();

    // Add reward to reward history
    const reward = new Reward({
      userId: userId,
      action: "post",
      coinsEarned: 1,
    });
    await reward.save();

    const newPost = new Post({
      user: userId,
      image,
      postDescription,
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const postAds = async (req, res) => {
  try {
    const user = await User.findById(req.body.user);

    if (user.creditLimit <= 0) {
      return res.status(400).json({ message: "Please buy credit to post Ad" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post(req.body);

    const savedPost = await newPost.save();

    user.creditLimit -= 1;
    await user.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    // Fetch only regular posts
    const regularPosts = await Post.find({ isTypeAd: false })
      .populate({
        path: "user",
        select: "name profilePic companyName",
      })
      .populate({
        path: "comments.user",
        select: "name profilePic",
      })
      .sort({ createdAt: -1 })
      .exec();

    // Fetch ads
    const ads = await Post.find({ isTypeAd: true })
      .populate({
        path: "user",
        select: "name profilePic companyName",
      })
      .sort({ createdAt: -1 })
      .exec();

    // Interleave ads after every 3 regular posts
    const posts = [];
    let adIndex = 0;

    for (let i = 0; i < regularPosts.length; i++) {
      posts.push(regularPosts[i]);
      if ((i + 1) % 3 === 0 && adIndex < ads.length) {
        // After every 3 posts, insert an ad if available
        posts.push(ads[adIndex++]);
      }
    }

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts and ads:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllMyAds = async (req, res) => {
  try {
    const { userId } = req.query;
    const posts = await Post.find({ user: userId, isTypeAd: true });
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add a comment on a Post
const addComment = async (req, res) => {
  try {
    const { userId, comment } = req.body;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Award virtual coins to user
    user.virtualCoins += 1; // Example: Award 1 coin per comment
    await user.save();

    // Add reward to reward history
    const reward = new Reward({
      userId: userId,
      action: "comment",
      coinsEarned: 1,
    });
    await reward.save();

    const newComment = {
      user: userId,
      comment: comment,
    };

    post.comments.push(newComment);
    await post.save();

    // Populate necessary fields before returning response
    post = await Post.findById(postId)
      .populate({
        path: "comments.user",
        select: "name profilePic",
      })
      .populate({
        path: "user",
        select: "-password",
      })
      .exec();

    res.status(201).json({ post, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Like / Dislike a Post
const LikePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLikedIndex = post.likes.indexOf(userId);
    if (alreadyLikedIndex !== -1) {
      post.likes.splice(alreadyLikedIndex, 1);
      await post.save();
      return res.status(200).json(post);
    }

    post.likes.push(userId);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Specific Post Details
const getSpecificPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId)
      .populate({
        path: "comments.user",
        select: "name profilePic",
      })
      .populate({
        path: "user",
        select: "name profilePic",
      })
      .exec();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a Post
const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete All posts
const deleteAllPosts = async (req, res) => {
  try {
    await Post.deleteMany({});

    res.status(200).json({ message: "All posts deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Posts of a Specific User
const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve all posts of the specified user
    const posts = await Post.find({ user: userId })
      .populate("user", "name profilePic")
      .populate("comments.user", "name profilePic")
      .exec();

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export {
  addPost,
  getAllPosts,
  getSpecificPost,
  getUserPosts,
  deletePost,
  addComment,
  LikePost,
  deleteAllPosts,
  postAds,
  getAllMyAds,
};
