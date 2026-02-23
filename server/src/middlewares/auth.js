const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
const Vendor = require("../models/Vendor");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.user = user;
    if (user.role === "VENDOR") {
      const vendor = await Vendor.findOne({ ownerUserId: user._id });
      req.vendor = vendor;
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

const requireApprovedVendor = (req, res, next) => {
  if (!req.vendor || req.vendor.status !== "APPROVED") {
    return res.status(403).json({ success: false, message: "Vendor not approved" });
  }
  next();
};

module.exports = { protect, requireRole, requireApprovedVendor };
