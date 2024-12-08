import express from "express";
import {
  getUserProfile,
  getUsers,
  login,
  logout,
  signup,
  updateUserProfile,
} from "../controller/user.controller.js";
import { checkAuth, checkAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/", checkAuth, checkAdmin, getUsers);
router.get("/profile", checkAuth, getUserProfile);
router.put("/profile", checkAuth, updateUserProfile);

export default router;
