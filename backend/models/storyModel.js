import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'image'
  },
  finish: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    required: true,
    default: 24, // Duration in hours
  },
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);

export default Story;
