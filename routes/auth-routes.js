const express = require("express");
const router = express.Router();
const {
  createUser,
  login,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  handleRefreshToken,
  logOut,
} = require("../controller/user-controller");
const { authMiddleware, isAdmin } = require("../middleware/auth-middleware");

router.post("/register", createUser);
router.put("/update-user/:id", authMiddleware, updateUser);
router.post("/login", login);
router.get("/all-users", authMiddleware, isAdmin, getAllUser);
router.get("/single-user/:id", authMiddleware, isAdmin, getUser);
router.delete("/delete-user/:id", authMiddleware, deleteUser);
router.get("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.get("/refresh", handleRefreshToken);
router.delete("/logout", logOut);

module.exports = router;
