// src/modules/admin/admin.routes.js
const express = require('express');
const { protect, restrictTo } = require('../../middlewares/auth.middleware');
const ctrl = require('./admin.controller');
const router = express.Router();

router.use(protect, restrictTo('ADMIN'));

router.get('/stats',            ctrl.getDashboardStats);
router.get('/users',            ctrl.getUsers);
router.get('/properties',       ctrl.getProperties);
router.patch('/properties/:id/approve', ctrl.approveProperty);
router.patch('/properties/:id/reject',  ctrl.rejectProperty);
router.get('/reports',          ctrl.getReports);
router.get('/logs',             ctrl.getLogs);

module.exports = router;
