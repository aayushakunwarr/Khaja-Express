const express = require("express");
const { listPublic, listAll, getById, getPublicDetail, getMe, updateMe, updateStatus, updateByAdmin } = require("../controllers/vendorController");
const { protect, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.get("/public", listPublic);
router.get("/", protect, requireRole("ADMIN"), listAll);
router.get("/:id", protect, requireRole("ADMIN"), getById);
router.get("/public/:slug", getPublicDetail);
router.get("/me", protect, requireRole("VENDOR"), getMe);
router.put("/me", protect, requireRole("VENDOR"), updateMe);
router.put("/:id/status", protect, requireRole("ADMIN"), updateStatus);
router.put("/:id", protect, requireRole("ADMIN"), updateByAdmin);

module.exports = router;
