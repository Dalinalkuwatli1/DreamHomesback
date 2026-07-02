// src/modules/properties/property.routes.js
const express  = require('express');
const { body, query } = require('express-validator');
const { validate }    = require('../../middlewares/validation.middleware');
const { protect, restrictTo, optionalAuth } = require('../../middlewares/auth.middleware');
const { uploadPropertyImages } = require('../../config/cloudinary');
const ctrl = require('./property.controller');

const router = express.Router();

// ─── Public ──────────────────────────────────────────────────────
router.get('/',     optionalAuth, ctrl.getAll);
router.get('/:id',  optionalAuth, ctrl.getById);

// ─── Protected ───────────────────────────────────────────────────
router.post('/', protect, uploadPropertyImages, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('type').isIn(['SALE', 'RENT']).withMessage('Type must be SALE or RENT'),
  body('city').trim().notEmpty().withMessage('City is required'),
  validate,
], ctrl.create);

router.put('/:id',   protect, uploadPropertyImages, ctrl.update);
router.delete('/:id', protect, ctrl.remove);
router.patch('/:id/status', protect, restrictTo('ADMIN'), ctrl.updateStatus);

module.exports = router;
