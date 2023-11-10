import express from "express";
import { authUser, checkUser, getAllUsers, registerUser } from "../controllers/userController.js";
const router = express.Router()



router.route('/register').post(registerUser)
router.route('/check').post(checkUser)
router.route('/login').post(authUser)
router.route('/all').get(getAllUsers)



export default router