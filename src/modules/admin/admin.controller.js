// src/modules/admin/admin.controller.js
const service = require('./admin.service');
const { sendSuccess } = require('../../utils/apiResponse');

const getDashboardStats = async (req, res) => sendSuccess(res, 200, 'Stats fetched',       await service.getDashboardStats());
const getUsers          = async (req, res) => {
  const { users, ...meta } = await service.getUsers(req.query);
  sendSuccess(res, 200, 'Users fetched', users, meta);
};
const getProperties = async (req, res) => {
  const { properties, ...meta } = await service.getProperties(req.query);
  sendSuccess(res, 200, 'Properties fetched', properties, meta);
};
const approveProperty = async (req, res) => sendSuccess(res, 200, 'Property approved', await service.approveProperty(parseInt(req.params.id)));
const rejectProperty  = async (req, res) => sendSuccess(res, 200, 'Property rejected', await service.rejectProperty(parseInt(req.params.id)));
const getReports      = async (req, res) => sendSuccess(res, 200, 'Reports fetched',   service.getReports());
const getLogs         = async (req, res) => sendSuccess(res, 200, 'Logs fetched',      service.getLogs());

module.exports = { getDashboardStats, getUsers, getProperties, approveProperty, rejectProperty, getReports, getLogs };
