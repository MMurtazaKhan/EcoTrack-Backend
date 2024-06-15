import express from "express";
import {
  authAdmin,
  authGoogle,
  authUser,
  deleteAllUsers,
  editProfile,
  forgotPassword,
  getAllUsers,
  getProfile,
  grantCredit,
  payment,
  registerUser,
  resetPassword,
  verifyCode,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/error.js";
const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/:id").get(getProfile);
router.route("/").delete(deleteAllUsers);
router.route("/register").post(registerUser);
router.route("/admin/login").post(authAdmin);
router.route("/login").post(authUser);
router.route("/payment").post(authenticateUser, payment);
router.route("/credit").put(authenticateUser, grantCredit);

// router.route('/update').put(updateUserDetails)
// router.route('/delete').delete(deleteUserAccount)
router.route("/register/google").post(authGoogle);
router.route("/login").post(authUser);
router.route("/all").get(getAllUsers);
router.route("/edit").put(authenticateUser, editProfile);

router.route("/forgotPassword").put(forgotPassword);
router.route("/verifyCode").post(verifyCode);
router.route("/resetPassword").put(resetPassword);

export default router;
