const express = require("express");
const { register, login, vendorSignup, adminCreate, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/vendor-signup", vendorSignup);
router.post("/admin-create", adminCreate);

module.exports = router;
