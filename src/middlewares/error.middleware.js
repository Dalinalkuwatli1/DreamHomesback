// src/middlewares/error.middleware.js
const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const handlePrismaError = (err) => {
  if (err.code === 'P2002') return new AppError(`Duplicate field value: ${err.meta?.target?.join(', ')}`, 409);
  if (err.code === 'P2025') return new AppError('Record not found', 404);
  if (err.code === 'P2003') return new AppError('Foreign key constraint failed', 400);
  return new AppError('Database error', 500);
};

const handleJWTError     = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpired   = () => new AppError('Token expired. Please log in again.', 401);
const handleValidation   = (err) => new AppError(Object.values(err.errors).map(e => e.message).join('. '), 400);

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status     = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success:    false,
      status:     err.status,
      message:    err.message,
      stack:      err.stack,
      error:      err,
    });
  }

  // Production: handle known error types
  let error = { ...err, message: err.message };

  if (err.name === 'PrismaClientKnownRequestError') error = handlePrismaError(err);
  if (err.name === 'JsonWebTokenError')              error = handleJWTError();
  if (err.name === 'TokenExpiredError')              error = handleJWTExpired();
  if (err.name === 'ValidationError')               error = handleValidation(err);

  if (error.isOperational) {
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }

  console.error('💥 UNEXPECTED ERROR:', err);
  return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
};

module.exports = { notFound, errorHandler };
