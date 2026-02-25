const { z } = require("zod");
const Banner = require("../models/Banner");
const { success, fail } = require("../utils/response");

const bannerSchema = z.object({
  title: z.string().min(2),
  imageUrl: z.string().url(),
  linkUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional()
});

const listPublic = async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
  return success(res, "Banners", banners);
};

const listAll = async (req, res) => {
  const banners = await Banner.find({}).sort({ createdAt: -1 });
  return success(res, "Banners", banners);
};

const createBanner = async (req, res) => {
  const parsed = bannerSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const banner = await Banner.create(parsed.data);
  return success(res, "Banner created", banner, 201);
};

const updateBanner = async (req, res) => {
  const parsed = bannerSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    return fail(res, "Banner not found", null, 404);
  }
  Object.assign(banner, parsed.data);
  await banner.save();
  return success(res, "Banner updated", banner);
};

const deleteBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    return fail(res, "Banner not found", null, 404);
  }
  await banner.deleteOne();
  return success(res, "Banner deleted", null);
};

module.exports = { listPublic, listAll, createBanner, updateBanner, deleteBanner };
