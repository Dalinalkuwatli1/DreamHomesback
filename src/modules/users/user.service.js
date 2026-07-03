// src/modules/users/user.service.js — Business Logic
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const AppError = require('../../utils/AppError');
const repo     = require('./user.repository');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

const createTokens = (id) => ({
  accessToken:  signToken(id),
  refreshToken: signRefreshToken(id),
});

// ─── Register ────────────────────────────────────────────────────
const register = async ({ name, email, password, phone, role }) => {
  const exists = await repo.findByEmail(email);
  if (exists) throw new AppError('Email already in use', 409);

  const hashedPassword = await bcrypt.hash(password, 12);
  // Accept role from frontend (USER or OWNER), default to USER
  const userRole = role && ['USER', 'OWNER'].includes(role.toUpperCase()) ? role.toUpperCase() : 'USER';
  const user = await repo.create({ name, email, password: hashedPassword, phone, role: userRole });

  const tokens = createTokens(user.id);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar }, ...tokens };
};

// ─── Login ───────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  const user = await repo.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (user.isBanned) throw new AppError('Your account has been suspended', 403);

  const tokens = createTokens(user.id);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone }, ...tokens };
};

// ─── Get Me ──────────────────────────────────────────────────────
const getMe = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

// ─── Update Me ───────────────────────────────────────────────────
const updateMe = async (id, data) => {
  const filtered = {};
  ['name', 'phone', 'bio', 'role'].forEach(f => { if (data[f] !== undefined) filtered[f] = data[f]; });
  return repo.updateById(id, filtered);
};

// ─── Update Password ─────────────────────────────────────────────
const updatePassword = async (id, { currentPassword, newPassword }) => {
  const user = await repo.findByEmail((await repo.findById(id)).email);
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw new AppError('Current password is incorrect', 401);
  }
  const hashed = await bcrypt.hash(newPassword, 12);
  await repo.updateById(id, { password: hashed });
  return createTokens(id);
};

// ─── Update Avatar ───────────────────────────────────────────────
const updateAvatar = async (id, fileUrl) => repo.updateById(id, { avatar: fileUrl });

// ─── Delete Me ───────────────────────────────────────────────────
const deleteMe = async (id) => repo.deleteById(id);

// ─── Admin: Get All ──────────────────────────────────────────────
const getAllUsers = async (query) => {
  const page  = parseInt(query.page)  || 1;
  const limit = parseInt(query.limit) || 10;
  const skip  = (page - 1) * limit;
  const where = query.search
    ? { OR: [{ name: { contains: query.search } }, { email: { contains: query.search } }] }
    : {};
  const [users, total] = await Promise.all([repo.findAll(skip, limit, where), repo.countAll(where)]);
  return { users, total, page, totalPages: Math.ceil(total / limit) };
};

// ─── Admin: Ban/Unban ────────────────────────────────────────────────
const banUser   = async (id) => repo.updateById(id, { isBanned: true });
const unbanUser = async (id) => repo.updateById(id, { isBanned: false });

// ─── Admin: Get User By Id ──────────────────────────────────────────
const getUserById = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

// ─── Admin: Delete User ─────────────────────────────────────────────
const deleteUser = async (id) => {
  const user = await repo.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return repo.deleteById(id);
};

// ─── Refresh Token ───────────────────────────────────────────────
const refreshToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await repo.findById(decoded.id);
  if (!user) throw new AppError('User not found', 401);
  return createTokens(user.id);
};

module.exports = {
  register, login, getMe, updateMe, updatePassword, updateAvatar,
  deleteMe, getAllUsers, banUser, unbanUser, refreshToken,
  getUserById, deleteUser,
};
