import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    previous: {
      type: Number,
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true
    },
    goalAchieved: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

// Create the Goal model
const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
