import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

// Define the user schema
const rewardSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    action: { 
        type: String, 
        required: true 
    }, // e.g., 'comment', 'post'
    coinsEarned: { 
        type: Number, 
        required: true 
    },
}, {timestamps: true});

const Reward = mongoose.model('Reward', rewardSchema);

export default Reward
