import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  image: {
    type: String,
    default: null,
  }
}, { timestamps: true });


userSchema.pre("save", async function(next) {
  if (!this.isModified("password")){
      next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Create the User model
const User = mongoose.model('User', userSchema);

export default User
