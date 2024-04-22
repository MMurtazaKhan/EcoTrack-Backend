import jwt from "jsonwebtoken";

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
const authenticateAdmin = (req, res, next) => {
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

    // Check if the user is an admin
    if (!decoded.isAdmin) {
      return res
        .status(403)
        .json({ message: "Forbidden: User is not an admin" });
    }

    req.userId = decoded.id;
    next();
  });
};

export { notFound, errorHandler, authenticateUser, authenticateAdmin };
