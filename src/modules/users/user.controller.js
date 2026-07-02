// src/modules/users/user.controller.js — MVC Controller
const service = require('./user.service');
const { sendSuccess } = require('../../utils/apiResponse');

const register = async (req, res) => {
  const result = await service.register(req.body);
  res.cookie('jwt', result.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 30 * 24 * 60 * 60 * 1000 });
  sendSuccess(res, 201, 'Registration successful', result);
};

const login = async (req, res) => {
  const result = await service.login(req.body);
  res.cookie('jwt', result.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 30 * 24 * 60 * 60 * 1000 });
  sendSuccess(res, 200, 'Login successful', result);
};

const logout = async (req, res) => {
  res.clearCookie('jwt');
  sendSuccess(res, 200, 'Logged out successfully');
};

const refreshToken = async (req, res) => {
  const token = req.cookies?.jwt || req.body?.refreshToken;
  const result = await service.refreshToken(token);
  sendSuccess(res, 200, 'Token refreshed', result);
};

const getMe           = async (req, res) => sendSuccess(res, 200, 'Profile fetched',   await service.getMe(req.user.id));
const updateMe        = async (req, res) => sendSuccess(res, 200, 'Profile updated',   await service.updateMe(req.user.id, req.body));
const updateAvatar    = async (req, res) => sendSuccess(res, 200, 'Avatar updated',    await service.updateAvatar(req.user.id, req.file?.path));
const updatePassword  = async (req, res) => sendSuccess(res, 200, 'Password updated',  await service.updatePassword(req.user.id, req.body));
const deleteMe        = async (req, res) => { await service.deleteMe(req.user.id); sendSuccess(res, 204, 'Account deleted'); };

const getAllUsers  = async (req, res) => sendSuccess(res, 200, 'Users fetched', ...(({users, ...meta}) => [users, meta])(await service.getAllUsers(req.query)));
const getUserById  = async (req, res) => sendSuccess(res, 200, 'User fetched',   await service.getUserById(parseInt(req.params.id)));
const banUser      = async (req, res) => sendSuccess(res, 200, 'User banned',    await service.banUser(parseInt(req.params.id)));
const unbanUser    = async (req, res) => sendSuccess(res, 200, 'User unbanned',  await service.unbanUser(parseInt(req.params.id)));
const deleteUser   = async (req, res) => { await service.deleteUser(parseInt(req.params.id)); sendSuccess(res, 204, 'User deleted'); };

const forgotPassword = async (req, res) => sendSuccess(res, 200, 'Reset email sent (not implemented)');
const resetPassword  = async (req, res) => sendSuccess(res, 200, 'Password reset (not implemented)');

module.exports = {
  register, login, logout, refreshToken, forgotPassword, resetPassword,
  getMe, updateMe, updateAvatar, updatePassword, deleteMe,
  getAllUsers, getUserById, banUser, unbanUser, deleteUser,
};
