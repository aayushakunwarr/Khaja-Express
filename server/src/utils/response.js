const sendResponse = (res, statusCode, payload) => {
  res.status(statusCode).json(payload);
};

const success = (res, message, data = null, statusCode = 200) => {
  sendResponse(res, statusCode, { success: true, message, data });
};

const fail = (res, message, errors = null, statusCode = 400) => {
  sendResponse(res, statusCode, { success: false, message, errors });
};

module.exports = { success, fail };
