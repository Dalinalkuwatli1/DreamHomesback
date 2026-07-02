// src/modules/favorites/favorite.routes.js
const express = require('express');
const { protect } = require('../../middlewares/auth.middleware');
const ctrl = require('./favorite.controller');
const router = express.Router();

router.get('/',           protect, ctrl.getMyFavorites);
router.post('/:propertyId', protect, ctrl.toggle);

module.exports = router;
