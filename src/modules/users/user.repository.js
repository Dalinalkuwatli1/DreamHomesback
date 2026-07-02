// src/modules/users/user.repository.js — Data Access Layer
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const userSelect = {
  id: true, name: true, email: true, phone: true,
  avatar: true, role: true, isBanned: true, isVerified: true,
  createdAt: true, _count: { select: { properties: true, favorites: true } },
};

const findById       = (id)    => prisma.user.findUnique({ where: { id }, select: userSelect });
const findByEmail    = (email) => prisma.user.findUnique({ where: { email } });
const findAll        = (skip, take, where = {}) =>
  prisma.user.findMany({ where, skip, take, select: userSelect, orderBy: { createdAt: 'desc' } });
const countAll       = (where = {}) => prisma.user.count({ where });
const create         = (data)  => prisma.user.create({ data });
const updateById     = (id, data) => prisma.user.update({ where: { id }, data, select: userSelect });
const deleteById     = (id)    => prisma.user.delete({ where: { id } });
const findByResetToken = (token) =>
  prisma.user.findFirst({ where: { passwordResetToken: token, passwordResetExpires: { gt: new Date() } } });

module.exports = { findById, findByEmail, findAll, countAll, create, updateById, deleteById, findByResetToken };
