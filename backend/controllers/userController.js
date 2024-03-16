import User from "../models/userModel.js"
import asyncHandler from 'express-async-handler'
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv"

dotenv.config()


// route for the user registration route
const registerUser = asyncHandler(async (req, res) => {
   
      const { name, email, password, image } = req.body;
      const userExists = await User.findOne({$or: [{ email: email }]})
      const contact = "873874387"
      if(userExists){
          res.status(400)
          throw new Error("User already exists")
      }
      const newUser = new User({ name, email, contact, password, image });
      const savedUser = await newUser.save();
  
      if (savedUser){
        res.status(201).json({
            _id : savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            rewards: savedUser.rewards,
            image: savedUser.image,
            isAdmin: savedUser.isAdmin,
            token: generateToken(savedUser._id, savedUser.isAdmin)
        })
    } })

// route for the user registration route
export const editProfile = asyncHandler(async (req, res) => {
    const { name, email, contact, password, image } = req.body;
  const userId = req.userId

  try {
    // Check if the user exists
    const user = await User.findById(userId);                                         

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data with provided information
    if (name) user.name = name;
    if (email) user.email = email;
    if (contact) user.contact = contact;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (image) user.image = image;

    // Save the updated user data
    await user.save();

    // Return the updated user data as response
    res.json({ user });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
      
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
              rewards: user.rewards,
              image: user.image,
              isAdmin: user.isAdmin,
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

  export {registerUser, authUser, getAllUsers, authGoogle}