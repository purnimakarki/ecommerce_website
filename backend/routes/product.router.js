import express from "express";
import { checkAdmin, checkAuth } from "../middleware/auth.middleware.js";
import {
  addProduct,
  addUserReview,
  canBeReviewed,
  deleteProduct,
  getProductById,
  getProducts,
  getTopProducts,
  updateProduct,
} from "../controller/product.controller.js";

const router = express.Router();

router.route("/").get(getProducts).post(checkAuth, checkAdmin, addProduct);
router.get("/top-products", getTopProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(checkAuth, checkAdmin, updateProduct)
  .delete(checkAuth, checkAdmin, deleteProduct);
router.put("/addreview/:id", checkAuth, addUserReview);
router.get("/:id/check-review-status", checkAuth, canBeReviewed);

export default router;
