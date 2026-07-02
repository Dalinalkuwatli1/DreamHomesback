// src/middlewares/auth.middleware.js
const jwt      = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError('You are not logged in. Please log in to access.', 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user)          return next(new AppError('The user belonging to this token no longer exists.', 401));
  if (user.isBanned)  return next(new AppError('Your account has been banned.', 403));

  req.user = user;
  next();
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
    }
  } catch {}
  next();
};

module.exports = { protect, restrictTo, optionalAuth };
