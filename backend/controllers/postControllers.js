import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";

dotenv.config();

// route for the user registration route
const addPost = asyncHandler(async (req, res) => {
  try {
    const { postDescription, images, tags } = req.body;
    console.log("User ID ", req.userId);
    const newPost = await Post.create({
      userId: req.userId,
      postDescription,
      images,
      tags,
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// route for getting all posts
const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name email"); // Populate userId with user details
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// route for getting all User posts
const getUserPosts = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const userPosts = await Post.find({ userId }).populate(
      "userId",
      "name email"
    ); // Populate user details
    return res.status(200).json(userPosts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// route for updating post
const updatePost = asyncHandler(async (req, res) => {

   
    try {
        const postId = req.params.postId;
        console.log("body: ",req.body)
        const updatedPost = await Post.findOneAndUpdate(
          { _id: postId, userId: req.userId }, 
          { $set: req.body },
          { new: true }
        );
    
        if (!updatedPost) {
          return res.status(404).json({ message: 'Post not found or unauthorized' });
        }
    
        return res.status(200).json(updatedPost);
      } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
      } })

      const updatePostActivity = asyncHandler(async (req, res) => {
        try {
          const postId = req.params.postId;
          const { comment, like, share } = req.body;
          
          const post = await Post.findById(postId);
          if (!post) {
            return res.status(404).json({ message: 'Post not found' });
          }
          
          // Fetch the owner of the post
          const postOwner = await User.findById(post.userId);
          const reqUser = await User.findById(req.userId);
      
          // Check if the user has already performed the action
          const userAction = post.actions.find(action => action.userId.equals(req.userId));
      
          if (comment && !userAction?.action.includes('comment')) {
            post.comments.push({ userId: req.userId, comment });
            post.commentCount = post.comments.length;
            // Add 20 rewards points for commenting to the post owner
            postOwner.rewards += 20;
            reqUser.rewards += 10;
            // Add the action to the post
            post.actions.push({ userId: req.userId, action: 'comment' });
          }
      
          if (like !== undefined && !userAction?.action.includes('like')) {
            const userIndex = post.likes.indexOf(req.userId);
            if (like && userIndex === -1) {
              // Add user ID to the likes array
              post.likes.push(req.userId);
              // Add 10 rewards points for liking to the post owner
              postOwner.rewards += 10;
              reqUser.rewards += 5;
              // Add the action to the post
              post.actions.push({ userId: req.userId, action: 'like' });
            } else if (!like && userIndex !== -1) {
              // Remove user ID from the likes array
              post.likes.splice(userIndex, 1);
              // Remove 10 rewards points if unliking to the post owner
              postOwner.rewards -= 10;
              // Add the action to the post
              post.actions.push({ userId: req.userId, action: 'unlike' });
            }
            // Update likeCount
            post.likeCount = post.likes.length;
          }
      
          if (share && !userAction?.action.includes('share')) {
            post.shares.push(req.userId);
            post.shareCount = post.shares.length;
            // Add 25 rewards points for sharing to the post owner
            postOwner.rewards += 25;
            reqUser.rewards += 15;
            // Add the action to the post
            post.actions.push({ userId: req.userId, action: 'share' });
          }
          
          // Save the updated user model of the post owner to reflect rewards changes
          await postOwner.save();
          await reqUser.save();
          await post.save();
          
          return res.status(200).json(post);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      });
      

const deletePost = asyncHandler(async (req, res) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await Post.findOneAndDelete({
      _id: postId,
      userId: req.userId,
    });

    if (!deletedPost) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    return res.status(204).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


export {addPost, getAllPosts, updatePost, deletePost, getUserPosts, updatePostActivity}
