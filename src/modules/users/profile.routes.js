// src/modules/users/profile.routes.js — Profile & Admin User Management
const express  = require('express');
const { body } = require('express-validator');
const { validate } = require('../../middlewares/validation.middleware');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
const { uploadAvatar } = require('../../config/cloudinary');
const ctrl = require('./user.controller');

const router = express.Router();

// ─── Profile Routes ──────────────────────────────────────────────
router.get('/me',       protect, ctrl.getMe);
router.patch('/me',     protect, ctrl.updateMe);
router.delete('/me',    protect, ctrl.deleteMe);
router.patch('/me/avatar', protect, uploadAvatar, ctrl.updateAvatar);
router.patch('/me/password', protect, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
  validate,
], ctrl.updatePassword);

// ─── Admin-only ──────────────────────────────────────────────────
router.get('/',     protect, restrictTo('ADMIN'), ctrl.getAllUsers);
router.get('/:id',  protect, restrictTo('ADMIN'), ctrl.getUserById);
router.patch('/:id/ban',    protect, restrictTo('ADMIN'), ctrl.banUser);
router.patch('/:id/unban',  protect, restrictTo('ADMIN'), ctrl.unbanUser);
router.delete('/:id',       protect, restrictTo('ADMIN'), ctrl.deleteUser);

module.exports = router;
