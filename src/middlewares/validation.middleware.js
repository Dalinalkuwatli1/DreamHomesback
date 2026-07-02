// src/middlewares/validation.middleware.js
const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => ({ field: e.path, message: e.msg }));
    return sendError(res, 422, 'Validation failed', messages);
  }
  next();
};

module.exports = { validate };
