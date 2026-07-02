// src/config/socket.js — Socket.IO Real-time Messaging
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // JWT Auth middleware for Socket
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication error: No token'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Track online users
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    onlineUsers.set(userId, socket.id);
    console.log(`✅ Socket connected: User ${userId}`);

    // Broadcast online status
    io.emit('user:online', { userId, online: true });

    // Join personal room
    socket.join(`user:${userId}`);

    // ─── Send Message ───────────────────────────────────────────
    socket.on('message:send', async (data) => {
      try {
        const { receiverId, content, chatId } = data;

        // Save to database
        const message = await prisma.message.create({
          data: {
            senderId:   userId,
            receiverId: parseInt(receiverId),
            content,
            chatId,
          },
          include: { sender: { select: { id: true, name: true, avatar: true } } },
        });

        // Emit to receiver
        io.to(`user:${receiverId}`).emit('message:receive', message);
        // Emit back to sender
        socket.emit('message:sent', message);

        // Create notification for receiver
        await prisma.notification.create({
          data: {
            userId:  parseInt(receiverId),
            type:    'MESSAGE',
            title:   `رسالة جديدة من ${message.sender.name}`,
            message: content.substring(0, 100),
          },
        });

        io.to(`user:${receiverId}`).emit('notification:new', {
          type: 'MESSAGE',
          from: message.sender.name,
        });
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ─── Typing indicator ───────────────────────────────────────
    socket.on('typing:start', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('typing:start', { userId });
    });
    socket.on('typing:stop', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('typing:stop', { userId });
    });

    // ─── Mark as Read ───────────────────────────────────────────
    socket.on('message:read', async ({ messageId }) => {
      await prisma.message.update({ where: { id: messageId }, data: { isRead: true } });
    });

    // ─── Disconnect ─────────────────────────────────────────────
    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('user:online', { userId, online: false });
      console.log(`❌ Socket disconnected: User ${userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { initSocket, getIO };
