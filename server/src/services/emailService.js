const nodemailer = require("nodemailer");

const buildTemplate = ({ title, body, ctaUrl, ctaLabel }) => {
  return `
  <div style="font-family: Arial, sans-serif; background: #fff7ed; padding: 24px;">
    <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 14px; padding: 24px; box-shadow: 0 12px 30px rgba(0,0,0,0.08);">
      <h2 style="color: #f97316; margin: 0 0 12px;">${title}</h2>
      <p style="color: #4b5563; line-height: 1.6;">${body}</p>
      ${ctaUrl ? `<a href="${ctaUrl}" style="display: inline-block; margin-top: 16px; background: #f97316; color: #fff; padding: 10px 18px; border-radius: 999px; text-decoration: none;">${ctaLabel}</a>` : ""}
      <p style="margin-top: 20px; color: #9ca3af; font-size: 12px;">Khaja Express</p>
    </div>
  </div>
  `;
};

const isEmailConfigured = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM);
};

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!isEmailConfigured()) {
    throw new Error("SMTP not configured");
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
};

const sendVendorPendingEmail = async ({ to, restaurantName }) => {
  const transporter = createTransporter();
  const html = buildTemplate({
    title: "Registration Received - Pending Approval",
    body: `Hello ${restaurantName}, we received your vendor registration. Our team is reviewing your details and will approve your account shortly. You will receive a confirmation email once approved.`,
    ctaUrl: null,
    ctaLabel: null
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Registration Received - Pending Approval",
    html
  });
};

const sendVendorApprovedEmail = async ({ to, restaurantName }) => {
  const transporter = createTransporter();
  const loginUrl = `${process.env.CLIENT_URL}/login`;
  const html = buildTemplate({
    title: "Your Vendor Account Is Approved",
    body: `Great news! ${restaurantName} is approved and ready to take orders. Log in to manage your menu and orders.`,
    ctaUrl: loginUrl,
    ctaLabel: "Log In"
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Vendor Approved - Start Selling",
    html
  });
};

const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  const transporter = createTransporter();
  const html = buildTemplate({
    title: "Reset your password",
    body: "We received a password reset request. Click the button below to set a new password.",
    ctaUrl: resetUrl,
    ctaLabel: "Reset Password"
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Password Reset",
    html
  });
};

module.exports = {
  sendVendorPendingEmail,
  sendVendorApprovedEmail,
  sendPasswordResetEmail,
  isEmailConfigured
};
