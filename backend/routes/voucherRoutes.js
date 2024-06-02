import express from "express";
import {
  addVoucher,
  allVouchers,
  allVouchersForUsers,
  disableVoucher,
} from "../controllers/voucherController.js";
import { authenticateAdmin } from "../middleware/error.js";
const router = express.Router();

// admin route
router.route("/addVoucher").post(authenticateAdmin, addVoucher);
router.route("/allVouchers").get(authenticateAdmin, allVouchers);
router.route("/disableVoucher").put(authenticateAdmin, disableVoucher);
router.route("/allVouchersForUsers").get(allVouchersForUsers);

export default router;
