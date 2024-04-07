import mongoose from "mongoose";
import User from "./userModel.js";

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postDescription: {
    type: String,
  },
  image: {
    type: String,
    default: "https://firebasestorage.googleapis.com/v0/b/ecotrack-decb2.appspot.com/o/placeholder.jpg?alt=media&token=ce98f9a3-584d-4ab3-9ce8-f38172e80848",
  },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  shares: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, { timestamps: true });

// Create the Post model
const Post = mongoose.model('Post', postSchema);

export default Post;
