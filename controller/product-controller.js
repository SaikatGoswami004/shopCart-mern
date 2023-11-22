const Product = require("../model/product-model");
const asyncHandler = require("express-async-handler");
const { validateId } = require("../utils/validateId");
const slugify = require("slugify");

exports.createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.create(req.body);
    return res.json(product);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

exports.getAllProduct = asyncHandler(async (req, res) => {
  try {
    const getProduct = await Product.find();
    return res.json(getProduct);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

exports.getProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    const getProduct = await Product.findById(id);
    return res.json(getProduct);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});
