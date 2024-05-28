import express from "express";
import {
  deleteCompany,
    listCompanies,
  registerCompany
} from "../controllers/companyControllers.js";

const router = express.Router();

router.route("/").get(listCompanies);
router.route("/register").post(registerCompany);
router.route("/:companyId").delete(deleteCompany);

export default router;
