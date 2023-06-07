const Product = require("../models/products");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongodbId = require("../utils/validateMongodbId");
const FlashSaleProduct = require("../models/flashSaleModel");
const { Category } = require("../models/category");

const createProduct = asyncHandler(async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(`${req.body.title}${Date.now()}`);
  }
  let newProduct = await Product.create(req.body);
  res.status(200).json(newProduct);
});

const getAllProduct = asyncHandler(async (req, res) => {
  // Filtering
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Product.find(JSON.parse(queryStr)).populate("category");

  // Sorting
  const sortBy = req.query.sort
    ? req.query.sort.split(",").join(" ")
    : "-createdAt";
  query = query.sort(sortBy);

  // Limiting the fields
  const fields = req.query.fields
    ? req.query.fields.split(",").join(" ")
    : "-__v";
  query = query.select(fields);

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // Get total count of products
  const totalProducts = await Product.countDocuments(queryObj);

  // Return products
  const products = await query;

  // Send response
  res.status(200).json({
    success: true,
    data: products,
    page,
    limit,
    totalProducts,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  if (req.body.title) {
    req.body.slug = slugify(`${req.body.title}${Date.now()}`);
  }
  const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  await updateProduct.save();
  res.status(200).json({ updateProduct, message: "success" });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const product = await Product.findById(id);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  const categoryIds = product.category;
  await Category.deleteMany({ _id: { $in: categoryIds } });

  await Product.findByIdAndRemove(id);

  res
    .status(200)
    .json({
      message: "Product and associated categories deleted successfully",
    });
});

const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const findProduct = await Product.findById(id).populate("category");
  res.status(200).json({ findProduct });
});

//get productCount
const getProductCount = asyncHandler(async (req, res) => {
  const productsCount = await Product.countDocuments();
  if (!productsCount) {
    return res.status(404).send("Invalid product count!");
  }
  return res.status(200).send({ productsCount });
});

module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductCount,
};
