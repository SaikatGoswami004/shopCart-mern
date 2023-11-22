const express = require("express");
const router = express.Router();

const { authMiddleware, isAdmin } = require("../middleware/auth-middleware");
const {
  createProduct,
  getProduct,
  getAllProduct,
} = require("../controller/product-controller");

router.post("/create", createProduct);
router.get("/get-product/:id", getProduct);
router.get("/get-products", getAllProduct);

module.exports = router;
