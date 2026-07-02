// src/modules/messages/message.repository.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const msgInclude = { sender: { select: { id: true, name: true, avatar: true } }, receiver: { select: { id: true, name: true, avatar: true } } };

const create        = (data)         => prisma.message.create({ data, include: msgInclude });
const findById      = (id)           => prisma.message.findUnique({ where: { id }, include: msgInclude });
const findBetween   = (u1, u2, skip, take) =>
  prisma.message.findMany({ where: { OR: [{ senderId: u1, receiverId: u2 }, { senderId: u2, receiverId: u1 }] }, skip, take, orderBy: { createdAt: 'asc' }, include: msgInclude });
const countBetween  = (u1, u2) =>
  prisma.message.count({ where: { OR: [{ senderId: u1, receiverId: u2 }, { senderId: u2, receiverId: u1 }] } });
const markRead      = (id) => prisma.message.update({ where: { id }, data: { isRead: true } });
const getChats      = (userId) =>
  prisma.message.findMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] }, distinct: ['senderId', 'receiverId'], orderBy: { createdAt: 'desc' }, include: msgInclude, take: 50 });

module.exports = { create, findById, findBetween, countBetween, markRead, getChats };
