// src/modules/notifications/notification.repository.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findAll    = (userId, skip, take) => prisma.notification.findMany({ where: { userId }, skip, take, orderBy: { createdAt: 'desc' } });
const countAll   = (userId)             => prisma.notification.count({ where: { userId } });
const countUnread= (userId)             => prisma.notification.count({ where: { userId, isRead: false } });
const markRead   = (id)                 => prisma.notification.update({ where: { id }, data: { isRead: true } });
const markAllRead= (userId)             => prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
const remove     = (id)                 => prisma.notification.delete({ where: { id } });

module.exports = { findAll, countAll, countUnread, markRead, markAllRead, remove };
