// src/modules/users/user.routes.js — Auth Routes only
const express  = require('express');
const { body } = require('express-validator');
const { validate } = require('../../middlewares/validation.middleware');
const ctrl = require('./user.controller');

const router = express.Router();

// ─── Auth Routes ─────────────────────────────────────────────────
router.post('/register', (req, res, next) => {
  console.log("REGISTER HIT", req.body);
  next();
}, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validate,
], ctrl.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
], ctrl.login);

router.post('/logout',        ctrl.logout);
router.post('/refresh-token', ctrl.refreshToken);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password/:token', ctrl.resetPassword);

module.exports = router;
