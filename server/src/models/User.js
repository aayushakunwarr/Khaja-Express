const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["CUSTOMER", "VENDOR", "ADMIN"],
      default: "CUSTOMER"
    },
    isActive: { type: Boolean, default: true },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    resetTokenHash: { type: String, default: "" },
    resetTokenExpires: { type: Date }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("User", userSchema);
