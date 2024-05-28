import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

const registerCompany = async (req, res) => {
    try {
      let { name, email, password } = req.body;
  
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "Company already exists" });
      }
  
      password = await bcrypt.hash(password, 10);
      user = new User({
        name,
        email,
        password,
        role: "company"
      });
  
      const savedUser = await user.save();
  
      const { password: _, ...userWithoutPassword } = savedUser.toObject();
  
      res.status(201).json({
        ...userWithoutPassword,
      });
    } catch (error) {
        console.log(error.message)
      res.status(500).json({ message: "Server Error" });
    }
  };


  const listCompanies = async (req, res) => {
    try {
      const companies = await User.find({ role: 'company' });
      res.status(200).json(companies);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  const deleteCompany = async (req, res) => {
    const { companyId } = req.params;

  try {
    // Find the company by ID
    const company = await User.findById(companyId);

    // Check if the user exists and has the role of "company"
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.role !== 'company') {
      return res.status(403).json({ message: 'User is not a company' });
    }

    // Delete the company
    await User.findByIdAndDelete(companyId);

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ message: 'Server Error' });
  }
  };



export {registerCompany, listCompanies, deleteCompany}
  