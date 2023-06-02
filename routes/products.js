const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductCount,
} = require("../controller/productCtl");

router.get("/", getAllProduct);
router.get("/:id", getaProduct);
router.post("/", authMiddleware, isAdmin, createProduct);
router.patch("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/productCount", authMiddleware, isAdmin, getProductCount);

module.exports = router;
