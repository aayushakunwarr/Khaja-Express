const express = require("express");
const { listPublic, listAll, createBanner, updateBanner, deleteBanner } = require("../controllers/bannerController");
const { protect, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.get("/public", listPublic);
router.get("/", protect, requireRole("ADMIN"), listAll);
router.post("/", protect, requireRole("ADMIN"), createBanner);
router.put("/:id", protect, requireRole("ADMIN"), updateBanner);
router.delete("/:id", protect, requireRole("ADMIN"), deleteBanner);

module.exports = router;
