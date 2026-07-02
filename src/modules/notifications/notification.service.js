// src/modules/notifications/notification.service.js
const repo = require('./notification.repository');

const getAll = async (userId, query) => {
  const page  = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip  = (page - 1) * limit;
  const [notifications, total, unread] = await Promise.all([repo.findAll(userId, skip, limit), repo.countAll(userId), repo.countUnread(userId)]);
  return { notifications, total, unread, page, totalPages: Math.ceil(total / limit) };
};

const markRead    = (id)     => repo.markRead(id);
const markAllRead = (userId) => repo.markAllRead(userId);
const remove      = (id)     => repo.remove(id);

module.exports = { getAll, markRead, markAllRead, remove };
