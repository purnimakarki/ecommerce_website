import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import asyncHandler from "../middleware/asynchandler.middleware.js";
import ApiError from "../utils/apiError.js";

// @desc get all products
// @route /api/v1/products
// @access public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 4;
  let page = Number(req.query.pageNumber) || 1;
  let keyword = req.query.keyword;
  keyword = keyword
    ? {
        $or: [
          {
            name: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            description: {
              $regex: keyword,
              $options: "i",
            },
          },
        ],
      }
    : {};
  let productCount = await Product.countDocuments({ ...keyword });
  let products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.send({ products, page, pages: Math.ceil(productCount / pageSize) });
});

// @desc get product by id
// @route /api/v1/products/:id
// @access public
const getProductById = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found!");
  }
  res.send(product);
});

// @desc add new product
// @route /api/v1/products
// @access public
const addProduct = asyncHandler(async (req, res) => {
  // let product = await Product.create({ ...req.body, user: req.user._id });
  let product = await Product.create({
    user: req.user._id,
    name: "Sample Name",
    description: "Sample Description",
    brand: "Sample Brand",
    category: "Sample Category",
    image: "/images/sample.jpg",
    rating: 0,
    price: 0,
    countInStock: 0,
  });
  res.send({ message: "Product added successfully", product });
});

// @desc update product
// @route /api/v1/products/:id
// @access private/admin
const updateProduct = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found!");
  product.name = req.body.name || product.name;
  product.description = req.body.description || product.description;
  product.image = req.body.image || product.image;
  product.brand = req.body.brand || product.brand;
  product.category = req.body.category || product.category;
  product.price = req.body.price || product.price;
  product.countInStock = req.body.countInStock || product.countInStock;
  let updatedProduct = await product.save();
  res.send({
    message: "Product updated successfully!",
    product: updatedProduct,
  });
});

// @desc delete product
// @route /api/v1/products/:id
// @access private/admin
const deleteProduct = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found!");
  await Product.findByIdAndDelete(id);
  res.send({ message: "Product deleted successfully!" });
});

const addUserReview = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let { rating, comment } = req.body;
  let product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found!");

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) throw new ApiError(400, "Already Reviewed!");

  product.reviews.push({
    name: req.user.name,
    user: req.user._id,
    rating,
    comment,
  });
  product.numReviews = product.reviews.length;
  let totalRating = product.reviews.reduce((acc, r) => acc + r.rating, 0);
  product.rating = (totalRating / product.reviews.length).toFixed(2);
  await product.save();
  res.send({ message: "Review added to product" });
});

const canBeReviewed = asyncHandler(async (req, res) => {
  let eligible = false;
  let productId = req.params.id;
  let userId = req.user._id;
  let orders = await Order.find({ user: userId, isDelivered: true });
  orders.forEach((order) => {
    let productOrder = order.orderItems.find(
      (item) => item.product == productId
    );
    if (productOrder) {
      eligible = true;
    }
  });
  if (eligible) {
    res.send({ canBeReviewed: true });
  } else {
    res.send({ canBeReviewed: false });
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.send(products);
});

export {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  addUserReview,
  canBeReviewed,
  getTopProducts,
};
