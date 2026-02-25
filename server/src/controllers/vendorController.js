const { z } = require("zod");
const Vendor = require("../models/Vendor");
const MenuItem = require("../models/MenuItem");
const { success, fail } = require("../utils/response");
const { toSlug } = require("../utils/slug");
const { sendVendorApprovedEmail } = require("../services/emailService");
const { getIO } = require("../socket");
const User = require("../models/User");

const updateVendorSchema = z.object({
  restaurantName: z.string().min(2).optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zone: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  cuisineTags: z.array(z.string()).optional(),
  openingHours: z.string().optional(),
  minOrder: z.number().min(0).optional(),
  deliveryFee: z.number().min(0).optional(),
  isOpenManualOverride: z.boolean().optional(),
  busyMode: z.boolean().optional()
});

const updateStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"])
});

const adminUpdateSchema = z.object({
  restaurantName: z.string().min(2).optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zone: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  cuisineTags: z.array(z.string()).optional(),
  openingHours: z.string().optional(),
  minOrder: z.number().min(0).optional(),
  deliveryFee: z.number().min(0).optional(),
  isOpenManualOverride: z.boolean().optional(),
  busyMode: z.boolean().optional(),
  commissionRate: z.number().min(0).max(0.5).optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional()
});

const listPublic = async (req, res) => {
  const { cuisine, search, city, zone, open, dish } = req.query;
  const filter = { status: "APPROVED" };
  if (city) {
    filter.city = new RegExp(city, "i");
  }
  if (zone) {
    filter.zone = new RegExp(zone, "i");
  }
  if (cuisine) {
    filter.cuisineTags = { $in: [new RegExp(cuisine, "i")] };
  }
  if (search) {
    filter.restaurantName = new RegExp(search, "i");
  }
  if (open === "true") {
    filter.isOpenManualOverride = true;
    filter.busyMode = false;
  }
  if (dish) {
    const items = await MenuItem.find({ name: new RegExp(dish, "i") }).select("vendorId");
    const vendorIds = items.map((item) => item.vendorId);
    filter._id = { $in: vendorIds };
  }
  const vendors = await Vendor.find(filter).sort({ createdAt: -1 });
  return success(res, "Vendors", vendors);
};

const listAll = async (req, res) => {
  const vendors = await Vendor.find({}).sort({ createdAt: -1 });
  return success(res, "All vendors", vendors);
};

const getById = async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    return fail(res, "Vendor not found", null, 404);
  }
  return success(res, "Vendor", vendor);
};

const getPublicDetail = async (req, res) => {
  const vendor = await Vendor.findOne({ slug: req.params.slug, status: "APPROVED" });
  if (!vendor) {
    return fail(res, "Vendor not found", null, 404);
  }
  const items = await MenuItem.find({ vendorId: vendor._id, isAvailable: true }).populate("categoryId");
  return success(res, "Vendor details", { vendor, items });
};

const getMe = async (req, res) => {
  const vendor = await Vendor.findOne({ ownerUserId: req.user._id });
  if (!vendor) {
    return fail(res, "Vendor not found", null, 404);
  }
  return success(res, "Vendor profile", vendor);
};

const updateMe = async (req, res) => {
  const parsed = updateVendorSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const vendor = await Vendor.findOne({ ownerUserId: req.user._id });
  if (!vendor) {
    return fail(res, "Vendor not found", null, 404);
  }
  const updates = parsed.data;
  if (updates.restaurantName) {
    const baseSlug = toSlug(updates.restaurantName);
    let slug = baseSlug;
    let counter = 1;
    while (await Vendor.findOne({ slug, _id: { $ne: vendor._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }
    updates.slug = slug;
  }
  Object.assign(vendor, updates);
  await vendor.save();
  return success(res, "Vendor updated", vendor);
};

const updateStatus = async (req, res) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    return fail(res, "Vendor not found", null, 404);
  }
  vendor.status = parsed.data.status;
  await vendor.save();

  if (vendor.status === "APPROVED") {
    const owner = await User.findById(vendor.ownerUserId);
    if (owner) {
      try {
        await sendVendorApprovedEmail({ to: owner.email, restaurantName: vendor.restaurantName });
      } catch (err) {
        console.error("Email send failed", err.message);
      }
    }
  }

  try {
    const io = getIO();
    io.to(`vendor:${vendor._id}`).emit("vendor:approved", { vendorId: vendor._id, status: vendor.status });
  } catch (err) {
    console.error("Socket emit failed", err.message);
  }

  return success(res, "Vendor status updated", vendor);
};

const updateByAdmin = async (req, res) => {
  const parsed = adminUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    return fail(res, "Vendor not found", null, 404);
  }
  const updates = parsed.data;
  if (updates.restaurantName) {
    const baseSlug = toSlug(updates.restaurantName);
    let slug = baseSlug;
    let counter = 1;
    while (await Vendor.findOne({ slug, _id: { $ne: vendor._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }
    updates.slug = slug;
  }
  Object.assign(vendor, updates);
  await vendor.save();
  return success(res, "Vendor updated", vendor);
};

module.exports = { listPublic, listAll, getById, getPublicDetail, getMe, updateMe, updateStatus, updateByAdmin };
