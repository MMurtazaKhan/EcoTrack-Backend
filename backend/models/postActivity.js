import mongoose from "mongoose";
import User from "./userModel"; 
import Post from "./postModel"; 

const postActivitySchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  shares: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, { timestamps: true });

// Create the PostActivity model
const PostActivity = mongoose.model('PostActivity', postActivitySchema);

export default PostActivity;
