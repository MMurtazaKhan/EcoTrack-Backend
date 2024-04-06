import express from "express";
import {
  authGoogle,
  authUser,
  deleteAllUsers,
  editProfile,
  forgotPassword,
  getAllUsers,
  getProfile,
  registerUser,
  resetPassword,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/error.js";
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/").delete(deleteAllUsers);
router.route("/register").post(registerUser);
router.route("/login").post(authUser);
// router.route('/update').put(updateUserDetails)
// router.route('/delete').delete(deleteUserAccount)
router.route("/register/google").post(authGoogle);
router.route("/login").post(authUser);
router.route("/all").get(getAllUsers);
router.route("/edit").put(authenticateUser, editProfile);
router.route("/profile").get(authenticateUser, getProfile);

router.route("/forgotPassword").put(forgotPassword);
router.route("/resetPassword").put(resetPassword);

// router.route('/check').get(checkUser)

export default router;
