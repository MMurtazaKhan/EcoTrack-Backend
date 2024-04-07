import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Reward from "../models/rewardsModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";

dotenv.config();

// route for the user registration route
// const addPost = asyncHandler(async (req, res) => {
//   try {
//     const { postDescription, images, tags } = req.body;
//     console.log("User ID ", req.userId);

//     // Find the user to get their image
//     const user = await User.findById(req.userId);

//     // Create a new post
//     const newPost = await Post.create({
//       userId: req.userId,
//       postDescription,
//       images,
//       tags,
//     });

//     // Include user's image in the response
//     const response = {
//       ...newPost.toJSON(),
//       userImage: user.image // Assuming the user's image is stored in the 'image' field of the User model
//     };

//     return res.status(201).json(response);
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // route for getting all posts
// const getAllPosts = asyncHandler(async (req, res) => {
//   try {
//     const posts = await Post.find().populate("userId", "name email image"); // Populate userId with user details
//     return res.status(200).json(posts);
//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // route for getting all User posts
// const getUserPosts = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.userId;
//     const userPosts = await Post.find({ userId }).populate(
//       "userId",
//       "name email"
//     ); // Populate user details
//     return res.status(200).json(userPosts);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // route for updating post
// const updatePost = asyncHandler(async (req, res) => {  
//     try {
//         const postId = req.params.postId;
//         console.log("body: ",req.body)
//         const updatedPost = await Post.findOneAndUpdate(
//           { _id: postId, userId: req.userId }, 
//           { $set: req.body },
//           { new: true }
//         );
    
//         if (!updatedPost) {
//           return res.status(404).json({ message: 'Post not found or unauthorized' });
//         }
    
//         return res.status(200).json(updatedPost);
//       } catch (error) {
//         return res.status(500).json({ message: 'Internal Server Error' });
// } })

// const updatePostActivity = asyncHandler(async (req, res) => {
//         try {
//           const postId = req.params.postId;
//           const { comment, like, share } = req.body;
          
//           const post = await Post.findById(postId).populate('comments.userId', 'name image').exec();
//           if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//           }
          
//           // Fetch the owner of the post
//           const postOwner = await User.findById(post.userId);
//           const reqUser = await User.findById(req.userId);
      
//           // Check if the user has already performed the action
//           const userAction = post.actions.find(action => action.userId.equals(req.userId));
      
//           if (comment && !userAction?.action.includes('comment')) {
//             post.comments.push({ userId: req.userId, comment });
//             post.commentCount = post.comments.length;
//             // Add 20 rewards points for commenting to the post owner
//             postOwner.rewards += 20;
//             reqUser.rewards += 10;
//             // Add the action to the post
//             post.actions.push({ userId: req.userId, action: 'comment' });
//           }
      
//           if (like !== undefined) {
//             const userIndex = post.likes.findIndex(userId => userId.equals(req.userId));
//             console.log(post.likes)
//             console.log(userIndex)
//             if (like && userIndex === -1) {
//               // Add user ID to the likes array
//               post.likes.push(req.userId);
//               // Add 10 rewards points for liking to the post owner
//               postOwner.rewards += 10;
//               reqUser.rewards += 5;
//               // Add the action to the post
//               post.actions.push({ userId: req.userId, action: 'like' });
//             } else if (like && userIndex !== -1) {
//               console.log("Like exists")
//               // Remove user ID from the likes array
//               post.likes.splice(userIndex, 1);
//               // Remove 10 rewards points if unliking to the post owner
//               postOwner.rewards -= 10;
//               // Add the action to the post
//               post.actions.push({ userId: req.userId, action: 'dislike' });
//             }
//             // Update likeCount
//             post.likeCount = post.likes.length;
//           }
      
//           if (share && !userAction?.action.includes('share')) {
//             post.shares.push(req.userId);
//             post.shareCount = post.shares.length;
//             // Add 25 rewards points for sharing to the post owner
//             postOwner.rewards += 25;
//             reqUser.rewards += 15;
//             // Add the action to the post
//             post.actions.push({ userId: req.userId, action: 'share' });
//           }
          
//           // Save the updated user model of the post owner to reflect rewards changes
//           await postOwner.save();
//           await reqUser.save();
//           await post.save();
      
//           // Construct response object
//           const response = {
//             ...post.toJSON(),
//             likes: await Promise.all(post.likes.map(async userId => {
//               const user = await User.findById(userId, 'name image');
//               return { userId, name: user.name, image: user.image };
//             })),
//             shares: await Promise.all(post.shares.map(async userId => {
//               const user = await User.findById(userId, 'name image');
//               return { userId, name: user.name, image: user.image };
//             })),
//             comments: post.comments.map(comment => ({
//               userId: comment.userId._id,
//               name: comment.userId.name,
//               image: comment.userId.image,
//               comment: comment.comment
//             }))
//           };
      
//           return res.status(200).json(response);
//         } catch (error) {
//           console.error(error);
//           return res.status(500).json({ message: 'Internal Server Error' });
//         }
// });     

// const deletePost = asyncHandler(async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const deletedPost = await Post.findOneAndDelete({
//       _id: postId,
//       userId: req.userId,
//     });

//     if (!deletedPost) {
//       return res
//         .status(404)
//         .json({ message: "Post not found or unauthorized" });
//     }

//     return res.status(204).json({ message: "Post deleted successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// Add a Single Post
const addPost = async (req, res) => {
  const { userId, image, postDescription } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Award virtual coins to user
    user.virtualCoins += 1; // Example: Award 1 coin per post
    await user.save();

    // Add reward to reward history
    const reward = new Reward({
      userId: userId,
      action: 'post',
      coinsEarned: 1,
    });
    await reward.save();

    const newPost = new Post({
      user: userId,
      image,
      postDescription
    });

    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate({
      path: 'user',
      select: 'name profilePic',
    }).populate({
      path: 'comments.user',
      select: 'name profilePic',
    }).sort({ createdAt: -1 }).exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a comment on a Post
const addComment = async (req, res) => {
  try {
    const { userId, comment } = req.body;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Award virtual coins to user
    user.virtualCoins += 1; // Example: Award 1 coin per comment
    await user.save();

    // Add reward to reward history
    const reward = new Reward({
      userId: userId,
      action: 'comment',
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
        path: 'comments.user',
        select: 'name profilePic',
      })
      .populate({
        path: 'user',
        select: 'name profilePic',
      })
      .exec();

    res.status(201).json(post);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Like / Dislike a Post
const LikePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
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
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get Specific Post Details
const getSpecificPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId).populate({
      path: 'comments.user',
      select: 'name profilePic',
    }).populate({
      path: 'user',
      select: 'name profilePic',
    }).exec();
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a Post
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete All posts
const deleteAllPosts = async (req, res) => {
  try {
    await Post.deleteMany({});

    res.status(200).json({ message: 'All posts deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get All Posts of a Specific User
const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve all posts of the specified user
    const posts = await Post.find({ user: userId }).populate('user', 'name profilePic').populate('comments.user', 'name profilePic').exec();

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

export { addPost, getAllPosts, getSpecificPost, getUserPosts, deletePost, addComment, LikePost, deleteAllPosts };
