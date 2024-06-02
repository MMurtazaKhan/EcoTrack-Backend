import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found: ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: err.stack,
  });
};

// Middleware to verify the bearer token and extract user ID
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Bearer token is missing" });
  }

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("error ", err.message);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.userId = decoded.id;
    next();
  });
};

//   // Middleware to authenticate admin users
const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(403)
        .json({ message: "You're not logged in. Please login first" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      const user = await User.findById(decoded.id); // Assume your JWT stores user ID in 'id' field
      if (!user || user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Forbidden: Admin access required" });
      }
      req.user = user;
      return next();
    }
  } catch (error) {
    console.error("err", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Unauthorized Access" });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
};

export { notFound, errorHandler, authenticateUser, authenticateAdmin };
