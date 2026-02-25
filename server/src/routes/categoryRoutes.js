const express = require("express");
const { listPublic, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { protect, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.get("/public", listPublic);
router.post("/", protect, requireRole("ADMIN"), createCategory);
router.put("/:id", protect, requireRole("ADMIN"), updateCategory);
router.delete("/:id", protect, requireRole("ADMIN"), deleteCategory);

module.exports = router;
