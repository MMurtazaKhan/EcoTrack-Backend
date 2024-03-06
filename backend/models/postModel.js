import mongoose from "mongoose";
import User from "./userModel.js";

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postDescription: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: null,
  },
  tags: {
    type: [String],
    default: null,
  },
  likeCount: {
    type: Number,
    default: null,
  },
  shareCount: {
    type: Number,
    default: null,
  },
  commentCount: {
    type: Number,
    default: null,
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
  actions: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      action: {
        type: String,
        required: true,
        enum: ['like', 'comment', 'share'],
      },
    },
  ],
}, { timestamps: true });

// Create the Post model
const Post = mongoose.model('Post', postSchema);

export default Post;
