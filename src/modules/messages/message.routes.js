// src/modules/messages/message.routes.js
const express = require('express');
const { protect } = require('../../middlewares/auth.middleware');
const ctrl = require('./message.controller');
const router = express.Router();

router.get('/chats',        protect, ctrl.getChats);
router.get('/chats/:userId',protect, ctrl.getChatMessages);
router.post('/',            protect, ctrl.send);
router.patch('/:id/read',   protect, ctrl.markRead);

module.exports = router;
