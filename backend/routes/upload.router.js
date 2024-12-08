import express from "express";
import multer from "multer";
import asyncHandler from "../middleware/asynchandler.middleware.js";
import ApiError from "../utils/apiError.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    let fn = `${Date.now()}-${file.originalname}`;
    cb(null, fn);
  },
});

const fileFilter = (req, file, cb) => {
  let filePattern = /\.(jpg|jpeg|png|webp)$/;
  if (!file.originalname.match(filePattern)) {
    cb(new ApiError(400, "Only image file supported"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

router.post(
  "/upload",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    res.send({
      message: "Image Uploaded!",
      filepath: `/${req.file.path}`,
    });
  })
);

export default router;
