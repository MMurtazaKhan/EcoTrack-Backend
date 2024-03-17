import express from "express";
import { authGoogle, authUser, checkUser, editProfile, getAllUsers, getProfile, registerUser, updateUserDetails, deleteUserAccount } from "../controllers/userController.js";
import {authenticateUser} from '../middleware/error.js';
const router = express.Router()

router.route('/').get(getAllUsers)
router.route('/register').post(registerUser)
router.route('/login').post(authUser)
router.route('/update').put(updateUserDetails)
router.route('/delete').delete(deleteUserAccount)
router.route('/register/google').post(authGoogle)
router.route('/login').post(authUser)
router.route('/all').get(getAllUsers)
router.route('/edit').put(authenticateUser, editProfile)
router.route('/profile').get(authenticateUser, getProfile)

router.route('/check').get(checkUser)


export default router