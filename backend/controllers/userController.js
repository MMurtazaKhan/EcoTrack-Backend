import User from "../models/userModel.js"
import asyncHandler from 'express-async-handler'
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv"

dotenv.config()


//Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ message: 'User already exists' });
        }
    
        user = new User({
          name,
          email,
          password,
        });
    
        const savedUser = await user.save();
    
        res.status(201).json({ 
            _id : savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            profilePic: savedUser.profilePic,
            token: generateToken(savedUser._id, savedUser.isAdmin) 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Login User
const login = async (req, res) => {};

// Update user details
const updateUserDetails = async (req, res) => {
    try {
      const userId = req.params.id;
      const updates = req.body;
  
      // Update user details
      const user = await User.findByIdAndUpdate(userId, updates, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return updated user
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
};

// Delete user account
export const deleteUserAccount = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Delete user account
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return success message
      res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
};

// route for the user registration route
const checkUser = asyncHandler(async (req, res) => {
    res.json("User api")
      
     })




    const authUser = asyncHandler(async (req, res) => {
      const {email, password, contact} = req.body
      const user = await User.findOne({$or: [{ email: email }, { contact: contact }]})
  
      if (user && (await user.matchPassword(password))){
          res.json({
              _id : user._id,
              name: user.name,
              email: user.email,
              contact: user.contact,
              token: generateToken(user._id, user.isAdmin)
          })
      }else {
          res.status(401)
          throw new Error("Invalid email or Password")
      }
  })




    const authGoogle = asyncHandler(async (req, res) => {
      const {email, name} = req.body
      const user = await User.findOne({$or: [{ email: email }]})
  
      if (user){
          res.json({
              _id : user._id,
              name: user.name,
              email: user.email,
              contact: user.contact,
              token: generateToken(user._id, user.isAdmin)
          })
      }else {
            
        const newUser = new User({ name, email });
      }
  })

    const getAllUsers = asyncHandler(async (req, res) => {
      
      const users = await User.find()
  
      if(users){
        res.status(200)
        res.json({users})
      }
      else {
          res.status(401)
          throw new Error("Invalid email or Password")
      }
  })

  export {registerUser, updateUserDetails, authUser, getAllUsers, checkUser, authGoogle}