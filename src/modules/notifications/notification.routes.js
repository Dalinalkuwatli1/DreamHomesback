// src/modules/notifications/notification.routes.js
const express = require('express');
const { protect } = require('../../middlewares/auth.middleware');
const ctrl = require('./notification.controller');
const router = express.Router();

router.get('/',              protect, ctrl.getAll);
router.patch('/:id/read',    protect, ctrl.markRead);
router.patch('/read-all',    protect, ctrl.markAllRead);
router.delete('/:id',        protect, ctrl.remove);

module.exports = router;
