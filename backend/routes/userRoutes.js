import express from "express";
import { authGoogle, authUser, checkUser, deleteUserAccount, getAllUsers, registerUser, updateUserDetails } from "../controllers/userController.js";
const router = express.Router();

router.route('/').get(getAllUsers)
router.route('/register').post(registerUser)
router.route('/login').post(authUser)
router.route('/update').put(updateUserDetails)
router.route('/delete').delete(deleteUserAccount)
router.route('/register/google').post(authGoogle)
router.route('/check').get(checkUser)


export default router