// src/modules/messages/message.service.js
const repo = require('./message.repository');

const send = async (senderId, { receiverId, content }) =>
  repo.create({ senderId, receiverId: parseInt(receiverId), content });

const getChatMessages = async (userId, otherId, query) => {
  const page  = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 30;
  const skip  = (page - 1) * limit;
  const uid   = parseInt(otherId);
  const [messages, total] = await Promise.all([repo.findBetween(userId, uid, skip, limit), repo.countBetween(userId, uid)]);
  return { messages, total, page, totalPages: Math.ceil(total / limit) };
};

const getChats  = (userId)     => repo.getChats(userId);
const markRead  = (id)         => repo.markRead(id);

module.exports = { send, getChatMessages, getChats, markRead };
