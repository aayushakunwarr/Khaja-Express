const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    isAvailable: { type: Boolean, default: true },
    prepTimeMins: { type: Number, default: 20 },
    isVeg: { type: Boolean, default: false },
    variants: [
      {
        name: String,
        priceDelta: { type: Number, default: 0 }
      }
    ],
    addons: [
      {
        name: String,
        price: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
