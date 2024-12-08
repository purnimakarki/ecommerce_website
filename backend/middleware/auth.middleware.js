import jwt from "jsonwebtoken";
import asyncHandler from "./asynchandler.middleware.js";
import User from "../models/user.model.js";

const checkAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token) {
    let err = new Error("You must be logged in!");
    err.status = 401;
    throw err;
  }
  try {
    let { userId } = jwt.verify(token, process.env.JWT_SECRET);
    let userdetail = await User.findById(userId).select("-password");
    req.user = userdetail;
    next();
  } catch (e) {
    let err = new Error("Invalid Token!");
    err.status = 401;
    throw err;
  }
});

const checkAdmin = asyncHandler(async (req, res, next) => {
  let { isAdmin } = req.user;
  if (isAdmin) next();
  else {
    let err = new Error("You are not authorized to peform this operation");
    err.status = 403;
    throw err;
  }
});

export { checkAuth, checkAdmin };
