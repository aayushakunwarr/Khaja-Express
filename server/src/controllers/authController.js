const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { z } = require("zod");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
const { signToken } = require("../utils/jwt");
const { toSlug } = require("../utils/slug");
const { success, fail } = require("../utils/response");
const { sendVendorPendingEmail, sendPasswordResetEmail, isEmailConfigured } = require("../services/emailService");

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).optional(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const vendorSignupSchema = z.object({
  restaurantName: z.string().min(2),
  ownerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(3),
  city: z.string().min(2),
  password: z.string().min(6)
});

const adminCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const forgotSchema = z.object({
  email: z.string().email()
});

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6)
});

const cleanUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.passwordHash;
  return obj;
};

const register = async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const { name, email, phone, password } = parsed.data;
  const exists = await User.findOne({ email });
  if (exists) {
    return fail(res, "Email already in use", null, 409);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, passwordHash, role: "CUSTOMER" });
  const token = signToken({ id: user._id, role: user.role });
  return success(res, "Registered", { token, user: cleanUser(user) }, 201);
};

const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) {
    return fail(res, "Invalid credentials", null, 401);
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return fail(res, "Invalid credentials", null, 401);
  }
  if (user.role === "VENDOR") {
    const vendor = await Vendor.findOne({ ownerUserId: user._id });
    if (!vendor || vendor.status !== "APPROVED") {
      return fail(res, "Vendor is not approved", null, 403);
    }
  }
  const token = signToken({ id: user._id, role: user.role });
  return success(res, "Login successful", { token, user: cleanUser(user) });
};

const vendorSignup = async (req, res) => {
  const parsed = vendorSignupSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const { restaurantName, ownerName, email, phone, address, city, password } = parsed.data;
  const exists = await User.findOne({ email });
  if (exists) {
    return fail(res, "Email already in use", null, 409);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: ownerName,
    email,
    phone,
    passwordHash,
    role: "VENDOR"
  });

  let baseSlug = toSlug(restaurantName);
  let slug = baseSlug;
  let counter = 1;
  while (await Vendor.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const vendor = await Vendor.create({
    ownerUserId: user._id,
    restaurantName,
    slug,
    address,
    city,
    status: "PENDING"
  });

  try {
    await sendVendorPendingEmail({ to: email, restaurantName });
  } catch (err) {
    console.error("Email send failed", err.message);
  }

  return success(res, "Vendor registration submitted", { vendorId: vendor._id }, 201);
};

const adminCreate = async (req, res) => {
  if (process.env.ALLOW_ADMIN_CREATE !== "true") {
    return fail(res, "Admin creation disabled", null, 403);
  }
  const parsed = adminCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const { name, email, password } = parsed.data;
  const exists = await User.findOne({ email });
  if (exists) {
    return fail(res, "Email already in use", null, 409);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: "ADMIN" });
  return success(res, "Admin created", { id: user._id }, 201);
};

const forgotPassword = async (req, res) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const { email } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) {
    return success(res, "If the email exists, a reset link was sent");
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetTokenHash = resetTokenHash;
  user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      return success(res, "SMTP not configured. Use the reset link below.", { resetUrl });
    }
    return success(res, "If the email exists, a reset link was sent");
  }
  try {
    await sendPasswordResetEmail({ to: email, resetUrl });
  } catch (err) {
    console.error("Reset email failed", err.message);
  }
  return success(res, "If the email exists, a reset link was sent");
};

const resetPassword = async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) {
    return fail(res, "Validation failed", parsed.error.flatten(), 400);
  }
  const { token, password } = parsed.data;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetTokenHash: tokenHash,
    resetTokenExpires: { $gte: new Date() }
  });
  if (!user) {
    return fail(res, "Reset token invalid or expired", null, 400);
  }
  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetTokenHash = "";
  user.resetTokenExpires = null;
  await user.save();
  return success(res, "Password reset successful");
};

module.exports = { register, login, vendorSignup, adminCreate, forgotPassword, resetPassword };
