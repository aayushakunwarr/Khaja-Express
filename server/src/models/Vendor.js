const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurantName: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zone: { type: String, default: "" },
    geo: {
      lat: Number,
      lng: Number
    },
    coverImageUrl: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    cuisineTags: [{ type: String }],
    openingHours: { type: String, default: "10:00 AM - 10:00 PM" },
    minOrder: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    isOpenManualOverride: { type: Boolean, default: true },
    busyMode: { type: Boolean, default: false },
    commissionRate: { type: Number, default: 0.1 },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
