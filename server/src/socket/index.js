const { Server } = require("socket.io");
const { verifyToken } = require("../utils/jwt");
const Vendor = require("../models/Vendor");

let io;

const initSocket = (httpServer, options) => {
  io = new Server(httpServer, options);

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Unauthorized"));
      }
      const decoded = verifyToken(token);
      socket.user = decoded;
      if (decoded.role === "VENDOR") {
        const vendor = await Vendor.findOne({ ownerUserId: decoded.id });
        if (vendor) {
          socket.vendorId = vendor._id.toString();
        }
      }
      return next();
    } catch (err) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { role, id } = socket.user;
    if (role === "ADMIN") {
      socket.join("admin:global");
    }
    if (role === "CUSTOMER") {
      socket.join(`customer:${id}`);
    }
    if (role === "VENDOR" && socket.vendorId) {
      socket.join(`vendor:${socket.vendorId}`);
    }
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };
