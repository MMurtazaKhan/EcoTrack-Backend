import express from "express";
import { authGoogle, authUser, editProfile, getAllUsers, registerUser } from "../controllers/userController.js";
import {authenticateUser} from '../middleware/error.js';
const router = express.Router()



router.route('/register').post(registerUser)
router.route('/register/google').post(authGoogle)
router.route('/login').post(authUser)
router.route('/all').get(getAllUsers)
router.route('/edit').put(authenticateUser, editProfile)



export default router