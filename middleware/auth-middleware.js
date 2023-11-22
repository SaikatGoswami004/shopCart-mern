const User = require("../model/user-model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorize or token expire");
    }
  } else {
    throw new Error("There is no token attach in heders");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const checkAdmin = req.user;
  if (checkAdmin?.role !== "admin") {
    throw new Error("You are not a admin");
  }
  next();
});
module.exports = { authMiddleware, isAdmin };
