import express from "express";
import { authGoogle, authUser, checkUser, getAllUsers, registerUser } from "../controllers/userController.js";
const router = express.Router()



router.route('/register').post(registerUser)
router.route('/register/google').post(authGoogle)
router.route('/check').get(checkUser)
router.route('/login').post(authUser)
router.route('/all').get(getAllUsers)



export default router