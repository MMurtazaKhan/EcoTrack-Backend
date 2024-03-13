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

    // Find the user to get their image
    const user = await User.findById(req.userId);

    // Create a new post
    const newPost = await Post.create({
      userId: req.userId,
      postDescription,
      images,
      tags,
    });

    // Include user's image in the response
    const response = {
      ...newPost.toJSON(),
      userImage: user.image // Assuming the user's image is stored in the 'image' field of the User model
    };

    return res.status(201).json(response);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


// route for getting all posts
const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name email image"); // Populate userId with user details
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
          
          const post = await Post.findById(postId).populate('comments.userId', 'name image').exec();
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
      
          if (like !== undefined) {
            const userIndex = post.likes.findIndex(userId => userId.equals(req.userId));
            console.log(post.likes)
            console.log(userIndex)
            if (like && userIndex === -1) {
              // Add user ID to the likes array
              post.likes.push(req.userId);
              // Add 10 rewards points for liking to the post owner
              postOwner.rewards += 10;
              reqUser.rewards += 5;
              // Add the action to the post
              post.actions.push({ userId: req.userId, action: 'like' });
            } else if (like && userIndex !== -1) {
              console.log("Like exists")
              // Remove user ID from the likes array
              post.likes.splice(userIndex, 1);
              // Remove 10 rewards points if unliking to the post owner
              postOwner.rewards -= 10;
              // Add the action to the post
              post.actions.push({ userId: req.userId, action: 'dislike' });
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
      
          // Construct response object
          const response = {
            ...post.toJSON(),
            likes: await Promise.all(post.likes.map(async userId => {
              const user = await User.findById(userId, 'name image');
              return { userId, name: user.name, image: user.image };
            })),
            shares: await Promise.all(post.shares.map(async userId => {
              const user = await User.findById(userId, 'name image');
              return { userId, name: user.name, image: user.image };
            })),
            comments: post.comments.map(comment => ({
              userId: comment.userId._id,
              name: comment.userId.name,
              image: comment.userId.image,
              comment: comment.comment
            }))
          };
      
          return res.status(200).json(response);
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
