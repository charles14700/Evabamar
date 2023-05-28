const router = require("express").Router();
const { createToken } = require("../controller/mpesa");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.get("/", createToken);

module.exports = router;
