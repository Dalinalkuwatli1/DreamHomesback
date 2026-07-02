// src/modules/messages/message.controller.js
const service = require('./message.service');
const { sendSuccess } = require('../../utils/apiResponse');

const send            = async (req, res) => sendSuccess(res, 201, 'Message sent',    await service.send(req.user.id, req.body));
const getChats        = async (req, res) => sendSuccess(res, 200, 'Chats fetched',   await service.getChats(req.user.id));
const getChatMessages = async (req, res) => {
  const { messages, ...meta } = await service.getChatMessages(req.user.id, req.params.userId, req.query);
  sendSuccess(res, 200, 'Messages fetched', messages, meta);
};
const markRead = async (req, res) => sendSuccess(res, 200, 'Marked as read', await service.markRead(parseInt(req.params.id)));

module.exports = { send, getChats, getChatMessages, markRead };
