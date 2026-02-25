const { z } = require("zod");
const Category = require("../models/Category");
const { success, fail } = require("../utils/response");
const { toSlug } = require("../utils/slug");

const categorySchema = z.object({
  name: z.string().min(2),
  imageUrl: z.string().trim().optional(),
  isActive: z.boolean().optional()
});

const normalizeImageUrl = (raw) => {
  if (raw === undefined || raw === null) {
    return { value: "" };
  }

  const trimmed = `${raw}`.trim();
  if (!trimmed) {
    return { value: "" };
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { error: "Image URL must start with http:// or https://" };
    }
    return { value: parsed.toString() };
  } catch {
    return { error: "Image URL is invalid" };
  }
};

const listPublic = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  return success(res, "Categories", categories);
};

const createCategory = async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const { name, imageUrl, isActive } = parsed.data;
  const normalizedImage = normalizeImageUrl(imageUrl);
  if (normalizedImage.error) {
    return fail(res, normalizedImage.error, { fieldErrors: { imageUrl: [normalizedImage.error] } }, 400);
  }
  const slug = toSlug(name);
  const exists = await Category.findOne({ slug });
  if (exists) {
    return fail(res, "Category already exists", null, 409);
  }
  const category = await Category.create({
    name,
    slug,
    imageUrl: normalizedImage.value,
    isActive: isActive !== false
  });
  return success(res, "Category created", category, 201);
};

const updateCategory = async (req, res) => {
  const parsed = categorySchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const category = await Category.findById(req.params.id);
  if (!category) {
    return fail(res, "Category not found", null, 404);
  }
  if (parsed.data.name) {
    category.name = parsed.data.name;
    category.slug = toSlug(parsed.data.name);
  }
  if (parsed.data.imageUrl !== undefined) {
    const normalizedImage = normalizeImageUrl(parsed.data.imageUrl);
    if (normalizedImage.error) {
      return fail(res, normalizedImage.error, { fieldErrors: { imageUrl: [normalizedImage.error] } }, 400);
    }
    category.imageUrl = normalizedImage.value;
  }
  if (parsed.data.isActive !== undefined) {
    category.isActive = parsed.data.isActive;
  }
  await category.save();
  return success(res, "Category updated", category);
};

const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return fail(res, "Category not found", null, 404);
  }
  await category.deleteOne();
  return success(res, "Category deleted", null);
};

module.exports = { listPublic, createCategory, updateCategory, deleteCategory };
