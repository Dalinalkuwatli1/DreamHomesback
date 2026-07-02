// src/modules/notifications/notification.controller.js
const service = require('./notification.service');
const { sendSuccess } = require('../../utils/apiResponse');

const getAll = async (req, res) => {
  const { notifications, ...meta } = await service.getAll(req.user.id, req.query);
  sendSuccess(res, 200, 'Notifications fetched', notifications, meta);
};
const markRead    = async (req, res) => sendSuccess(res, 200, 'Marked read',      await service.markRead(parseInt(req.params.id)));
const markAllRead = async (req, res) => sendSuccess(res, 200, 'All marked read',  await service.markAllRead(req.user.id));
const remove      = async (req, res) => { await service.remove(parseInt(req.params.id)); sendSuccess(res, 204, 'Deleted'); };

module.exports = { getAll, markRead, markAllRead, remove };
