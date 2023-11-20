import User from "../models/userModel.js"
import asyncHandler from 'express-async-handler'
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv"

dotenv.config()


// route for the user registration route
const registerUser = asyncHandler(async (req, res) => {
   
      const { name, email, contact, password, image } = req.body;
      const userExists = await User.findOne({$or: [{ email: email }]})
      if(userExists){
          res.status(400)
          throw new Error("User already exists")
      }
      const newUser = new User({ name, email, contact,  password, image });
      const savedUser = await newUser.save();
  
      if (savedUser){
        res.status(201).json({
            _id : savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            contact: savedUser.contact,
            token: generateToken(savedUser._id)
        })
    } })

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
              token: generateToken(user._id)
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
              token: generateToken(user._id)
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

  export {registerUser, authUser, getAllUsers, checkUser, authGoogle}