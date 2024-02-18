import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  category: {
    type: String,
    required: true
  },
  goalValue: {
    type: Number,
    required: true
  },
  goalDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Create the Goal model
const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
